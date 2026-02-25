---
title: Next.js 프로젝트에서 서버사이드 처리하기 (리디렉션, 데이터 프리페칭)
date: "2024-01-28"
description: "Next.js 프로젝트에서 리디렉션 & tanstack-query 데이터 프리페칭을 서버사이드에서 처리한 경험을 공유한다."
tag: ["ssr", "next.js"]
category: "Next.js"
---

React.js 프로젝트를 Next.js 프로젝트로 마이그레이션 할 일이 있었고,
마이그레이션과 함께 다시 프로젝트를 재구성하면서 Next.js의 장점을 살려보고자 클라이언트에서 처리하던 것들을 서버단으로 옮겼던 경험을 적어보고자 한다.

## 1. Router Guard 처리하기

특정 사용자만이 접근할 수 있는 페이지(Vue의 Navigation Guards를 생각하면서 나는 이걸 Guard라고 부른다.)를 만들 때 세 가지 방법이 있다.

1. 클라이언트에서 처리하기
2. middleware
3. getInitialProps / getServerSideProps

해당 프로젝트의 경우 단순 로그인/비로그인이 아닌 유저 정보에 따라 4번의 분기처리가 있고, 각각 도달해야하는 페이지가 달라서 리디렉션 처리를 해야하는 비즈니스 로직이 복잡했다.

원래 되어있던 상태가 1번이었지만, 페이지가 보여진 다음 리디렉션 처리가 되어야 한다는 점과 그때문에 사용자 입장에서 느리게 느껴진다는 점 때문에 2, 3 중에 하나로 처리할 생각을 했다.

2번의 경우 루트에 있는 middleware.ts에서 모든 리디렉션 분기를 다 처리해야하는데, 모든 페이지가 해당 파일을 공유하고 있다는 점(페이지마다 처리를 다르게 하기 위해선 if-else가 늘어날 수밖에 없다는 점), 그리고 이미 middleware에서 다른 로직을 처리하고 있었는데 비즈니스 로직이 섞이는 게 보기 좋지 않다는 점에서 제외했다.

3번의 경우 페이지마다 getInitialProps나 getServerSideProps는 하나만 만들 수 있는데, 이미 next-i18n(지역화) 설정 때문에 getServerSideProps를 사용할수밖에 없는 것도 있었고, 추후 react-query의 SSR을 적용하게 될 경우를 생각해서 getServerSideProps를 선택하게 됐다.

이 과정에서 엄청나게 많은 아티클을 찾아봤었는데 가장 도움이 됐던건 이 논의 였던 것 같다. ([https://github.com/vercel/next.js/discussions/10925](https://github.com/vercel/next.js/discussions/10925))

### getServerSideProps에서 guard처리하기

위 discussion을 참고하여 페이지 자체 getServerSideProps에는 영향을 주지않으며, 필요할 때 비즈니스 로직 단계를 추가할 수 있는 withAuthServerSideProps 함수를 만들었다.

```jsx
import { GetServerSidePropsContext } from 'next';

...

export function withAuthServerSideProps(getServerSidePropsFunc?: Function){
  return async (context: GetServerSidePropsContext) => {
    if (!accessToken || !refreshToken)
    return {
      redirect: {
        destination: LOGIN_URL, // 토큰이 없을 때 이동할 url
        statusCode: 302,
      },
    };

    ...

  if (userInfo.type === "admin")
      return {
          redirect: {
            destination: ADMIN_URL, // 계정 타입에 따라 이동할 url
            statusCode: 302,
          },
      };

    ...

  if (getServerSidePropsFunc) {
      const data = await getServerSidePropsFunc(context, queryClient);

	  return {
        ...data,
        props: {
          ...data?.props,
        },
      };
    }
  }
}

```

```jsx
// page/home.tsx

function Home() {}

export const getServerSideProps = withAuthServerSideProps()
//페이지 자체의 getServerSideProps가 필요할 때, 따로 생성하여 argument에 넣어준다.
```

이런 식으로 page의 인증로직을 담당하는 withAuthServerSideProps와, 지역화를 담당하는 withLocalizationServerSideProps 모듈을 만들었다.

이렇게 함으로써 페이지마다 다른 로직을 적용할 수도 있고 페이지 자신의 getServerSideProps도 쓸 수 있게 되었다.

## 2. (React-query)ServerSid Prefetching

리디렉션 다음으로 적용했던 것은 서버사이드 프리페칭이었다.

해당 프로젝트는 다른 프로젝트와 GNB를 공유하고 있었는데, 링크를 이동하면서 로딩이 걸리는 것이 사용자의 사용성을 해친다는 생각이 들었고 ssr 처리를 하기로 했다.

React-query의 SSR 문서([https://tanstack.com/query/v4/docs/framework/react/guides/ssr](https://tanstack.com/query/v4/docs/framework/react/guides/ssr))를 보고 세팅했으며, 구성하면서 겪은 이슈에 대해 공유하고자 한다.

### 서버 사이드에서 쿠키처리하기

대부분의 API 들은 인증 토큰을 같이 보내줘야 하지만, 클라이언트에서는 바로 쿠키를 읽으면 되는 반면 getServerSideProps에서는 context를 통해 http req 헤더를 전달해야 쿠키를 읽을 수 있다는 문제가 있다.

```jsx
import { GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';

...

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
    const { res, req } = context;

    const accessToken = getCookie(ACCESS_TOKEN, { req, res });

		...
})
```

이 문제에 대해 처음에는 클라이언트에서는 axios interceptor를 통해 브라우저에서 쿠키를 읽어 토큰을 넣는 로직이 돌아가고 있었으므로, 서버 단에서는 따로 axios를 생성해서(axios가 두개로 나눠지는 게 불편했지만 추후 리팩토링을 기약하면서) 처리를 했다.

이렇게 했을 때 처음에는 문제가 없었지만, QueryKey에 쿠키값이 들어가야 하는 경우가 생기면서 문제가 생겼다.

QueryKey에 쿠키 값이 들어가야하는 경우, 서버에서 초기 HTML을 생성할 때 쿼리 키가 undefined로 뜨면서 미리 생성해 둔 데이터를 가져올 수 없기 때문에 Hydration 불일치 문제가 생겼다.

그래서 서버 단과 클라이언트 단에서 동일한 axios를 사용할 필요가 생겼고, 같은 고민을 한 사람이 없을까 찾아보다가 해당 이슈를 발견하게 됐다.

https://github.com/axios/axios/issues/4976

위 이슈를 참고하여 다음과 같이 getServerSideProps를 구성했다.

```jsx
import { setContext } from '@/libs/context';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  setContext(context);
  const { res, req } = context;

  const accessToken = getCookie(ACCESS_TOKEN, { req, res });

  ...
})

```

```jsx
// @/libs/context.ts

import { GetServerSidePropsContext } from "next"

export let context: GetServerSidePropsContext | null = null

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context
}
```

```jsx
//axios 세팅

import { context } from "@/libs/context"
import { getCookie } from "cookies-next"

const isServer = typeof window === "undefined"

axios.interceptors.request.use(
  async function (config) {
    const accessToken = isServer
      ? context?.req?.cookies?.accessToken
      : getCookie(ACCESS_TOKEN)
    config.headers.Authorization = `${accessToken}`

    return config
  },

  function (error) {
    return Promise.reject(error)
  }
)
```

이렇게 함으로써 서버단과 클라이언트에서 같은 쿠키를 공유하게 되면서 Hydration 문제를 해결하면서도 같은 axios 인스턴스를 재사용 할 수 있게 되었다.

### largePageData

next.js에서는 페이지 데이터가 128kb를 넘으면 성능에 문제 생길 수 있다고 경고를 띄우고 있다. (참고: [https://nextjs.org/docs/messages/large-page-data](https://nextjs.org/docs/messages/large-page-data))

해당 경고의 경우, next.config.js에서 크기를 늘려 해결할 수 있다.

```jsx
const nextConfig = {
	...
  experimental: {
    largePageDataBytes: 800 * 1000,
  },
};
```

디폴트 설정은 명확한 이유가 없으면 지키는게 맞다고 생각한다.

나또한 해당 경고가 떴지만 성능을 해치면서 SSR을 적용하는건 좋지 않다고 생각해서 일부 적용을 보류했고, 불필요하게 많은 데이터가 오고 있는 api를 재구성해달라고 요청을 드렸다.

## Reference

- [https://www.youtube.com/watch?v=yQ93MyKyCmo](https://www.youtube.com/watch?v=yQ93MyKyCmo)
- [https://github.com/vercel/next.js/discussions/10925](https://github.com/vercel/next.js/discussions/10925)
- https://github.com/axios/axios/issues/4976

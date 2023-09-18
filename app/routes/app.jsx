import {json} from '@remix-run/node';
import {Link, Outlet, useLoaderData, useRouteError} from '@remix-run/react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import {boundary} from '@shopify/shopify-app-remix/server';
import {AppProvider} from '@shopify/shopify-app-remix/react';

import {authenticate} from '../shopify.server';

export const links = () => [{rel: 'stylesheet', href: polarisStyles}];

export async function loader({request}) {
  await authenticate.admin(request);

  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
    appBridgeUrl: process.env.APP_BRIDGE_URL,
  });
}

export default function App() {
  const {apiKey, appBridgeUrl} = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} __APP_BRIDGE_URL={appBridgeUrl}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

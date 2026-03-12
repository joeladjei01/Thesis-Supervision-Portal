// Export all error components for easy importing

export { default as PageNotFound } from "./PageNotFound";
export { default as ServerError } from "./ServerError";
export { default as ForbiddenError } from "./ForbiddenError";
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as GenericError } from "./GenericError";
export { default as RouteErrorElement } from "./RouteErrorElement";

// Example usage documentation:
/**
 * USAGE EXAMPLES:
 *
 * 1. 404 Page Not Found Error:
 *    import { PageNotFound } from '@/components/shared/errors';
 *    <PageNotFound />
 *
 * 2. 500 Server Error:
 *    import { ServerError } from '@/components/shared/errors';
 *    <ServerError />
 *
 * 3. 403 Forbidden Error:
 *    import { ForbiddenError } from '@/components/shared/errors';
 *    <ForbiddenError />
 *
 * 4. Error Boundary (Wrap your app):
 *    import { ErrorBoundary } from '@/components/shared/errors';
 *    <ErrorBoundary>
 *      <YourComponent />
 *    </ErrorBoundary>
 *
 * 5. Generic Error Component:
 *    import { GenericError } from '@/components/shared/errors';
 *    <GenericError
 *      statusCode={400}
 *      title="Bad Request"
 *      message="The request is invalid"
 *      icon="🚫"
 *      onRetry={() => location.reload()}
 *      customAction={{
 *        label: "Contact Support",
 *        action: () => window.open('mailto:support@example.com')
 *      }}
 *    />
 *
 * 6. Route Error Element (In routes):
 *    import { RouteErrorElement } from '@/components/shared/errors';
 *
 *    {
 *      path: "/",
 *      element: <Layout />,
 *      errorElement: <RouteErrorElement />,
 *      children: [...]
 *    }
 */

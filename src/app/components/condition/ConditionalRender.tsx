export function ConditionalRender({
  children,
  renderIf: shouldRender,
}: {
  children: React.ReactNode;
  renderIf: () => boolean;
}) {
  if (shouldRender()) {
    return children;
  }
  return null;
}

export function RenderIfDefined<T>(props: {
  value: T | undefined;
  loader?: () => React.ReactNode;
  Component: (props: { value: T }) => React.ReactNode;
}) {
  if (props.value === undefined) {
    return props.loader ? props.loader() : null;
  }
  return <props.Component value={props.value} />;
}

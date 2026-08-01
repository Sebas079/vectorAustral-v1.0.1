// This declaration allows TypeScript to treat CSS imports as modules in the Next.js app.
declare module "*.css" {
  const content: Record<string, string>
  export default content
}

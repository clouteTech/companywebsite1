/**
 * Templates remount on every navigation, so the incoming page plays a short CSS entrance.
 * The new page is committed immediately — the animation never holds the navigation back.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

import { PERMISSIONS, type Permission } from "@repo/access/constants"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import PageLoadingComponent from "@repo/ui/components/page-loading.component"
import NotFound404 from "@repo/ui/components/404.component"

type WithAccessPageOptions = {
  LoadingComponent?: React.ComponentType
  NotFoundComponent?: React.ComponentType
}

export function withPermission<T extends object>(
  permission: Permission,
  PageComponent: React.ComponentType<T>,
  options: WithAccessPageOptions = {
    LoadingComponent: PageLoadingComponent,
    NotFoundComponent: NotFound404,
  },
): React.ComponentType<T> {
  const { LoadingComponent, NotFoundComponent } = options

  return function AccessCheckedClientComponent(props: T) {
    const session = useSession()
    const router = useRouter()

    if (session.data?.user?.permissions.includes(PERMISSIONS[permission])) {
      return <PageComponent {...props} />
    }

    if (session.status === "loading") {
      if (!LoadingComponent) return null
      return (
        <section className="relative h-full p-4">
          <LoadingComponent />
        </section>
      )
    }

    if (!NotFoundComponent) {
      router.push("/")
      return null
    }

    return <NotFoundComponent />
  }
}

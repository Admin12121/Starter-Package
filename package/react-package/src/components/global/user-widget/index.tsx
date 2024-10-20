import { Message } from "@/icons"
import { Link } from "react-router-dom"
import { Notification } from "./notification"
import { UserAvatar } from "./user"

type UserWidgetProps = {
  image: string
  groupid?: string
  userid?: string
}

export const UserWidget = ({ image, groupid, userid }: UserWidgetProps) => {
  return (
    <div className="gap-5 items-center hidden md:flex">
      <Notification />
      <Link to={`/group/${groupid}/messages`}>
        <Message />
      </Link>
      <UserAvatar userid={userid} image={image} groupid={groupid} />
    </div>
  )
}

import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

export default dayjs

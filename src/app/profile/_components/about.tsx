"use client"

import React from "react"
import { CiAt, CiMail, CiCalendar, CiPhone, CiGlobe } from "react-icons/ci"
import { IoMdPerson } from "react-icons/io"
import { MdOutlineTransgender } from "react-icons/md"
import { FaRegHeart, FaAddressBook } from "react-icons/fa"
import { Copy, ExternalLink, Check, User, Sparkles } from "lucide-react"
import { type UserProfile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type AboutItemProps = {
  Icon: React.ComponentType<{ className?: string }>
  itemName: string
  itemValue: string | Date
  isClickable?: boolean
  category?: "personal" | "contact" | "social"
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

const hoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
}

const AboutItem = React.memo(
  ({
    Icon,
    itemName,
    itemValue,
    isClickable = false,
    category = "personal",
  }: AboutItemProps) => {
    const [copied, setCopied] = React.useState(false)
    const isNotSet = itemValue === "not set"
    const isWebsite = itemName === "website" && !isNotSet
    const isEmail = itemName === "email" && !isNotSet
    const isPhone = itemName === "phone number" && !isNotSet

    const handleCopy = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error("Failed to copy")
      }
    }

    const handleExternalLink = (url: string) => {
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`
      window.open(formattedUrl, "_blank", "noopener,noreferrer")
    }

    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case "personal":
          return "from-blue-500/10 to-blue-600/5 border-blue-200/20"
        case "contact":
          return "from-green-500/10 to-green-600/5 border-green-200/20"
        case "social":
          return "from-purple-500/10 to-purple-600/5 border-purple-200/20"
        default:
          return "from-gray-500/10 to-gray-600/5 border-gray-200/20"
      }
    }

    const formatValue = (value: string | Date) => {
      if (value instanceof Date) {
        return format(value, "MMMM dd, yyyy")
      }
      return value.toString()
    }

    return (
      <motion.div
        layout
        variants={itemVariants}
        whileHover="hover"
        whileTap="tap"
        className="group"
      >
        <motion.div variants={hoverVariants}>
          <Card
            className={cn(
              "border-0 bg-gradient-to-r backdrop-blur-sm transition-all duration-300",
              getCategoryColor(category),
              "hover:shadow-primary/5 hover:shadow-lg"
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center overflow-hidden rounded-lg">
                {/* Icon Section */}
                <div className="bg-background/60 group-hover:bg-primary/5 flex items-center gap-3 p-4 transition-all duration-300">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-foreground group-hover:text-primary font-semibold capitalize transition-colors">
                      {itemName}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs capitalize"
                    >
                      {category}
                    </Badge>
                  </div>
                </div>

                {/* Value Section */}
                <div className="bg-background/40 group-hover:bg-background/60 flex flex-1 items-center justify-between p-4 transition-all duration-300">
                  <div className="min-w-0 flex-1">
                    {isNotSet ? (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Optional
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-foreground/90 group-hover:text-foreground break-all transition-colors">
                        {formatValue(itemValue)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isNotSet && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {/* Copy Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(itemValue.toString())}
                        className="hover:bg-primary/10 h-8 w-8 p-0"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="h-3 w-3 text-green-600" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="h-3 w-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>

                      {/* External Link Button */}
                      {(isWebsite || isEmail) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (isWebsite) {
                              handleExternalLink(itemValue.toString())
                            } else if (isEmail) {
                              window.location.href = `mailto:${itemValue}`
                            }
                          }}
                          className="hover:bg-primary/10 h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Phone Call Button */}
                      {isPhone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `tel:${itemValue}`)
                          }
                          className="hover:bg-primary/10 h-8 w-8 p-0"
                        >
                          <CiPhone className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }
)

AboutItem.displayName = "AboutItem"

const About = ({
  profilePromise,
}: {
  profilePromise: Promise<UserProfile>
}) => {
  const userProfile = React.use(profilePromise)

  const aboutItems = [
    {
      Icon: CiAt,
      itemName: "username",
      itemValue: `${userProfile?.name?.split(" ").join("").toLowerCase()}`,
      category: "personal" as const,
    },
    {
      Icon: CiMail,
      itemName: "email",
      itemValue: userProfile?.email ?? "not set",
      category: "contact" as const,
      isClickable: true,
    },
    {
      Icon: IoMdPerson,
      itemName: "name",
      itemValue: userProfile?.name ?? "not set",
      category: "personal" as const,
    },
    {
      Icon: CiCalendar,
      itemName: "birth date",
      itemValue: userProfile?.birthDate ?? "not set",
      category: "personal" as const,
    },
    {
      Icon: MdOutlineTransgender,
      itemName: "gender",
      itemValue: userProfile?.gender ?? "not set",
      category: "personal" as const,
    },
    {
      Icon: FaRegHeart,
      itemName: "relationship status",
      itemValue: userProfile?.relationshipStatus ?? "not set",
      category: "personal" as const,
    },
    {
      Icon: CiPhone,
      itemName: "phone number",
      itemValue: `${userProfile?.phoneNumber ?? "not set"}`,
      category: "contact" as const,
      isClickable: true,
    },
    {
      Icon: CiGlobe,
      itemName: "website",
      itemValue: userProfile?.website ?? "not set",
      category: "social" as const,
      isClickable: true,
    },
    {
      Icon: FaAddressBook,
      itemName: "address",
      itemValue: userProfile?.address ?? "not set",
      category: "contact" as const,
    },
  ]

  // Group items by category
  const groupedItems = React.useMemo(() => {
    const groups = {
      personal: aboutItems.filter((item) => item.category === "personal"),
      contact: aboutItems.filter((item) => item.category === "contact"),
      social: aboutItems.filter((item) => item.category === "social"),
    }
    return groups
  }, [aboutItems])

  const categoryConfig = {
    personal: {
      title: "Personal Information",
      icon: <User className="h-5 w-5" />,
      color: "text-blue-600",
    },
    contact: {
      title: "Contact Details",
      icon: <CiPhone className="h-5 w-5" />,
      color: "text-green-600",
    },
    social: {
      title: "Social & Web",
      icon: <CiGlobe className="h-5 w-5" />,
      color: "text-purple-600",
    },
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <Sparkles className="text-primary h-6 w-6" />
        <h2 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
          About
        </h2>
      </motion.div>

      {/* Grouped Items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {Object.entries(groupedItems).map(([category, items]) => (
          <motion.div key={category} variants={itemVariants}>
            <div className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    categoryConfig[category as keyof typeof categoryConfig]
                      .color
                  )}
                >
                  {categoryConfig[category as keyof typeof categoryConfig].icon}
                  <h3 className="text-lg font-semibold">
                    {
                      categoryConfig[category as keyof typeof categoryConfig]
                        .title
                    }
                  </h3>
                </div>
                <Separator className="flex-1" />
              </div>

              {/* Category Items */}
              <motion.div variants={containerVariants} className="space-y-3">
                <AnimatePresence>
                  {items.map((item) => (
                    <AboutItem key={item.itemName} {...item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default About

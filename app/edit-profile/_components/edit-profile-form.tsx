"use client"

import { type User } from "@/lib/generated/prisma"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { userSchema } from "@/lib/validations/user"
import * as z from "zod"
import {
  User as UserIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Heart as HeartIcon,
  Globe,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import * as React from "react"
import { updateUserInformation } from "@/server/user"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { getErrorMessage } from "@/lib/handle-error"

interface EditProfileFormProps {
  editProfilePromise: Promise<User>
}

type UserSchema = z.infer<typeof userSchema>

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

// Form sections configuration
const formSections = [
  {
    title: "Basic Information",
    description: "Your public profile information",
    icon: UserIcon,
    fields: ["username", "name", "bio"],
  },
  {
    title: "Contact Details",
    description: "How people can reach you",
    icon: PhoneIcon,
    fields: ["phoneNumber", "website", "address"],
  },
  {
    title: "Personal Information",
    description: "Additional details about yourself",
    icon: HeartIcon,
    fields: ["gender", "relationshipStatus", "birthDate"],
  },
]

// Relationship status options
const relationshipOptions = [
  { value: "single", label: "Single" },
  { value: "in_a_relationship", label: "In a relationship" },
  { value: "married", label: "Married" },
  { value: "engaged", label: "Engaged" },
]

// Gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

const EditProfileForm = ({ editProfilePromise }: EditProfileFormProps) => {
  const user = React.use(editProfilePromise)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const defaultValues = React.useMemo(
    () => ({
      username: user?.username || user?.id || "",
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || null,
      bio: user?.bio || null,
      website: user?.website || null,
      address: user?.address || null,
      gender: user?.gender || null,
      relationshipStatus: user?.relationshipStatus || null,
      birthDate: user?.birthDate as Date,
    }),
    [user]
  )

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const handleSubmit = async (data: UserSchema) => {
    setIsSubmitting(true)

    try {
      await toast.promise(updateUserInformation(data), {
        loading: "Saving your profile...",
        success: () => {
          setTimeout(() => {
            window.location.href = `/profile/${user.id}`
          }, 1000)
          return "Profile updated successfully!"
        },
        error: (error) => getErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-4xl space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          Edit Profile
        </h1>
        <p className="text-muted-foreground">
          Update your profile information and preferences
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {formSections.map((section, sectionIndex) => (
            <motion.div key={section.title} variants={itemVariants}>
              <Card className="from-background/80 to-muted/30 border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <section.icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-muted-foreground text-sm font-normal">
                        {section.description}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {section.fields.map((fieldName) => (
                      <FormFieldComponent
                        key={fieldName}
                        name={fieldName as keyof UserSchema}
                        form={form}
                        isSubmitting={isSubmitting}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-end pt-6">
            <motion.div
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 min-w-[140px] bg-gradient-to-r"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  )
}

// Individual form field component
interface FormFieldComponentProps {
  name: keyof UserSchema
  form: any
  isSubmitting: boolean
}

const FormFieldComponent = ({
  name,
  form,
  isSubmitting,
}: FormFieldComponentProps) => {
  const fieldConfigKeys = [
    "username",
    "name",
    "bio",
    "phoneNumber",
    "website",
    "address",
    "gender",
    "relationshipStatus",
    "birthDate",
  ] as const

  type FieldConfigKey = (typeof fieldConfigKeys)[number]

  const configs: Record<
    FieldConfigKey,
    {
      label: string
      placeholder: string
      icon: React.ComponentType<any>
      type: string
      options?: { value: string; label: string }[]
    }
  > = {
    username: {
      label: "Username",
      placeholder: "Enter your username",
      icon: UserIcon,
      type: "input",
    },
    name: {
      label: "Display Name",
      placeholder: "Enter your display name",
      icon: UserIcon,
      type: "input",
    },
    bio: {
      label: "Bio",
      placeholder: "Tell us about yourself...",
      icon: MessageSquare,
      type: "textarea",
    },
    phoneNumber: {
      label: "Phone Number",
      placeholder: "+1 (555) 123-4567",
      icon: PhoneIcon,
      type: "input",
    },
    website: {
      label: "Website",
      placeholder: "https://yourwebsite.com",
      icon: Globe,
      type: "input",
    },
    address: {
      label: "Address",
      placeholder: "Enter your address",
      icon: MapPinIcon,
      type: "input",
    },
    gender: {
      label: "Gender",
      placeholder: "Select your gender",
      icon: UserIcon,
      type: "select",
      options: genderOptions,
    },
    relationshipStatus: {
      label: "Relationship Status",
      placeholder: "Select your relationship status",
      icon: HeartIcon,
      type: "select",
      options: relationshipOptions,
    },
    birthDate: {
      label: "Birth Date",
      placeholder: "Select your birth date",
      icon: UserIcon,
      type: "date",
    },
  }

  const getFieldConfig = (fieldName: FieldConfigKey) => {
    return configs[fieldName]
  }

  const config = getFieldConfig(name as any)
  if (!config) return null

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center gap-2 text-sm font-medium">
            <config.icon className="text-muted-foreground h-4 w-4" />
            {config.label}
          </FormLabel>
          <FormControl>
            <motion.div
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {config.type === "input" && (
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder={config.placeholder}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="focus:ring-primary/20 transition-all duration-200 focus:ring-2"
                />
              )}

              {config.type === "textarea" && (
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder={config.placeholder}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  rows={3}
                  className="focus:ring-primary/20 resize-none transition-all duration-200 focus:ring-2"
                />
              )}

              {config.type === "select" && (
                <Select
                  disabled={isSubmitting}
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value || null)}
                >
                  <SelectTrigger className="focus:ring-primary/20 transition-all duration-200 focus:ring-2">
                    <SelectValue placeholder={config.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toUpperCase()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {config.type === "date" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className={cn(
                        "hover:bg-muted/50 w-full justify-start text-left font-normal transition-all duration-200",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{config.placeholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </motion.div>
          </FormControl>
          <AnimatePresence>
            {form.formState.errors[name] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FormMessage />
              </motion.div>
            )}
          </AnimatePresence>
        </FormItem>
      )}
    />
  )
}

export default EditProfileForm

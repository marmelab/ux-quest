import { useState } from "react"
import { PencilIcon, CheckIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock data ---

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  role: string
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@acmecorp.com",
    phone: "(415) 555-0132",
    company: "Acme Corp",
    role: "Product Manager",
  },
  {
    id: 2,
    name: "James Wilson",
    email: "j.wilson@globexinc.com",
    phone: "(212) 555-0198",
    company: "Globex Inc",
    role: "Software Engineer",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "m.garcia@initech.io",
    phone: "(305) 555-0147",
    company: "Initech",
    role: "Design Lead",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@soylent.co",
    phone: "(628) 555-0165",
    company: "Soylent Corp",
    role: "Data Analyst",
  },
  {
    id: 5,
    name: "Emily Brooks",
    email: "e.brooks@wayneent.com",
    phone: "(312) 555-0184",
    company: "Wayne Enterprises",
    role: "Marketing Director",
  },
  {
    id: 6,
    name: "Alex Turner",
    email: "a.turner@umbrella.co",
    phone: "(503) 555-0112",
    company: "Umbrella LLC",
    role: "Sales Manager",
  },
]

// --- Toast notification ---

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed right-4 bottom-4 z-[100] flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm shadow-lg transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <CheckIcon className="size-4 text-emerald-600" />
      {message}
    </div>
  )
}

// --- Main component ---

function ContactTableEdit() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  })

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function openEditor(contact: Contact) {
    setEditingContact({ ...contact })
    setEmailError("")
    setDialogOpen(true)
  }

  function handleSave() {
    if (!editingContact) return
    if (!isValidEmail(editingContact.email)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setContacts((prev) =>
      prev.map((c) => (c.id === editingContact.id ? editingContact : c))
    )
    setDialogOpen(false)
    setEditingContact(null)
    showToast(`${editingContact.name} updated successfully`)
  }

  function showToast(message: string) {
    setToast({ message, visible: true })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000)
  }

  function updateField(field: keyof Contact, value: string) {
    if (!editingContact) return
    setEditingContact({ ...editingContact, [field]: value })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 p-4 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium">Contacts</h2>
          <p className="text-xs text-muted-foreground">
            {contacts.length} contacts in your directory
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Company</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="w-[60px] text-xs" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.email}
                </TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.role}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditor(contact)}
                    aria-label={`Edit ${contact.name}`}
                  >
                    <PencilIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* BUG: The dialog uses controlled `open` state but does not pass `onOpenChange` to the Dialog root.
           This means clicking the backdrop or pressing Escape has no effect — the dialog can only be
           closed via the Save or X (close) button. Users expect to dismiss dialogs by clicking outside
           or pressing Escape. */}
      <Dialog open={dialogOpen}>
        <DialogContent showCloseButton={false}>
          {editingContact && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
                <DialogDescription>
                  Update the contact information for {editingContact.name}.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                <div className="grid gap-3 py-1">
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label className="justify-end" htmlFor="edit-name">
                      Name *
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingContact.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-3">
                    <Label className="mt-2 justify-end" htmlFor="edit-email">
                      Email *
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingContact.email}
                        onChange={(e) => {
                          updateField("email", e.target.value)
                          if (emailError) setEmailError("")
                        }}
                        aria-invalid={!!emailError}
                      />
                      {emailError && (
                        <p className="mt-1 text-xs text-destructive">
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label className="justify-end" htmlFor="edit-phone">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={editingContact.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label className="justify-end" htmlFor="edit-company">
                      Company
                    </Label>
                    <Input
                      id="edit-company"
                      value={editingContact.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label className="justify-end" htmlFor="edit-role">
                      Role
                    </Label>
                    <Input
                      id="edit-role"
                      value={editingContact.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false)
                      setEditingContact(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}

// --- Definition export ---

export const contactTableEdit: MiniAppDefinition = {
  id: "contact-table-edit",
  name: "Contact Directory",
  introduction: "An editable contact directory.",
  category: "interaction",
  difficulty: "hard",
  component: ContactTableEdit,
  expectedAnswers: [
    "The edit dialog cannot be closed by clicking outside of it or pressing the Escape key.",
    "Clicking the backdrop doesn't dismiss the dialog — you can only close it with the buttons inside.",
    "The modal doesn't close when pressing Escape, which is unexpected behavior for a dialog.",
    "There is no way to dismiss the dialog by clicking outside or using the keyboard Escape key.",
    "The dialog ignores standard dismissal patterns — clicking the overlay or pressing Escape does nothing.",
    "Users expect to close a dialog by clicking outside it or pressing Escape, but neither works here.",
    "The edit modal traps you in — the only way out is through the Cancel or Save button, not the backdrop or Escape.",
    "Pressing Escape or clicking outside the dialog should close it, but neither action works.",
  ],
  hint: "Focus on the edit dialog",
  wrongAnswers: [
    "The table doesn't have pagination for large datasets.",
    "There is no search or filter functionality.",
    "The form fields don't have proper validation.",
    "The toast notification disappears too quickly.",
    "The table is missing a phone number column.",
    "There is no confirmation before saving changes.",
  ],
}

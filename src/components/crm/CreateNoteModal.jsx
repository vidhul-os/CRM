import { useState, useEffect } from 'react'
import { useNotesStore } from '@/stores/notesStore'
import { useToastStore } from '@/stores/toastStore'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FileText, Type, Pin } from 'lucide-react'

export default function CreateNoteModal({ isOpen, onClose }) {
  const { createNote, loading } = useNotesStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    content: '',
    type: 'Note',
    pinned: false
  })

  useEffect(() => {
    if (isOpen) {
      setForm({ content: '', type: 'Note', pinned: false })
    }
  }, [isOpen])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) return addToast('Content is required', 'error')

    const result = await createNote(form)

    if (result.success) {
      queryClient.invalidateQueries(['notes'])
      addToast('Note captured!', 'success')
      onClose()
    } else {
      addToast(result.error || 'Failed to create note', 'error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Capture Interaction Note" size="md">
      <form onSubmit={onSubmit} className="space-y-6">
        <Select 
          label="Interaction Type" 
          value={form.type}
          onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
          options={[
            { value: 'Note',    label: 'Standard Note' },
            { value: 'Meeting', label: 'Meeting Log' },
            { value: 'Call',    label: 'Call Summary' },
            { value: 'Email',   label: 'Email Draft/Log' }
          ]}
          icon={Type}
        />

        <div className="flex flex-col gap-1.5">
           <label className="text-[11px] font-black text-muted uppercase tracking-widest px-1">Content</label>
           <textarea 
             className="w-full h-40 bg-surface/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none placeholder:text-muted/50"
             placeholder="Write your observation here..."
             value={form.content}
             onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
           />
        </div>

        <div className="flex items-center gap-2 px-1">
           <input 
             type="checkbox" 
             id="pinned"
             checked={form.pinned}
             onChange={(e) => setForm(f => ({ ...f, pinned: e.target.checked }))}
             className="w-4 h-4 rounded border-border text-primary focus:ring-primary/10"
           />
           <label htmlFor="pinned" className="text-xs font-bold text-sidebar cursor-pointer select-none">Pin to top of feed</label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" className="rounded-xl h-12" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">
            Save Note
          </Button>
        </div>
      </form>
    </Modal>
  )
}

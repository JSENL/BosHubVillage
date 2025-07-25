import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Megaphone, 
  Send, 
  Edit, 
  Trash2, 
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { toast } from 'sonner';

export const GNEAnnouncements = () => {
  const { 
    announcements, 
    loading, 
    actionLoading, 
    createAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement, 
    sendAnnouncement 
  } = useAnnouncements();

  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    try {
      await createAnnouncement(newTitle, newMessage);
      setNewTitle('');
      setNewMessage('');
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSendAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to send this announcement to ALL registered users? This action cannot be undone.')) {
      return;
    }

    try {
      await sendAnnouncement(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEditAnnouncement = async () => {
    if (!editingAnnouncement?.title.trim() || !editingAnnouncement?.message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    try {
      await updateAnnouncement(editingAnnouncement.id, editingAnnouncement.title, editingAnnouncement.message);
      setEditingAnnouncement(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAnnouncement(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getStatusBadge = (announcement: any) => {
    if (announcement.status === 'sent') {
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sent ({announcement.recipients_count} users)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <Clock className="h-3 w-3 mr-1" />
        Draft
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading announcements...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Megaphone className="h-5 w-5 mr-2 text-purple-600" />
            GNE! Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Announcement */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Megaphone className="h-4 w-4 mr-2" />
                Create New GNE! Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create GNE! Announcement</DialogTitle>
                <DialogDescription>
                  This announcement will be sent to ALL registered users via email.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your announcement message"
                    rows={8}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setNewTitle('');
                    setNewMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAnnouncement}
                  disabled={actionLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Create Draft
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Announcements Table */}
          {announcements.length === 0 ? (
            <div className="text-center p-8">
              <Megaphone className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
              <p className="text-gray-600">Create your first GNE! announcement to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {announcement.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(announcement)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {announcement.sent_at 
                          ? new Date(announcement.sent_at).toLocaleDateString()
                          : '-'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {announcement.status === 'draft' && (
                          <Button
                            onClick={() => handleSendAnnouncement(announcement.id)}
                            disabled={actionLoading}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            GNE!
                          </Button>
                        )}
                        
                        {announcement.status === 'draft' && (
                          <Button
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setIsEditDialogOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            disabled={actionLoading}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          variant="destructive"
                          size="sm"
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update your announcement before sending it to users.
            </DialogDescription>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({
                    ...editingAnnouncement,
                    title: e.target.value
                  })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={editingAnnouncement.message}
                  onChange={(e) => setEditingAnnouncement({
                    ...editingAnnouncement,
                    message: e.target.value
                  })}
                  placeholder="Enter your announcement message"
                  rows={8}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingAnnouncement(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditAnnouncement}
              disabled={actionLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Update Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GNEAnnouncements;
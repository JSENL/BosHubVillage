import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  type: 'business' | 'event' | 'news' | 'local_service';
  created_at: string;
}

export const CategoriesManagement = () => {
  const [newCategory, setNewCategory] = useState({ name: '', type: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (category: { name: string; type: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
      setNewCategory({ name: '', type: '' });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to add category: ' + error.message);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (category: { id: string; name: string; type: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: category.name, type: category.type })
        .eq('id', category.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update category: ' + error.message);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete category: ' + error.message);
    }
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.type) {
      toast.error('Please fill in all fields');
      return;
    }
    addCategoryMutation.mutate(newCategory);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim() || !editingCategory.type) {
      toast.error('Please fill in all fields');
      return;
    }
    updateCategoryMutation.mutate(editingCategory);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'news': return 'bg-purple-100 text-purple-800';
      case 'local_service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const typeOptions = [
    { value: 'business', label: 'Business' },
    { value: 'event', label: 'Event' },
    { value: 'news', label: 'Culture' },
    { value: 'local_service', label: 'Local Resource' }
  ];

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Categories Management
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Category Type</Label>
                  <Select value={newCategory.type} onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddCategory} disabled={addCategoryMutation.isPending}>
                  {addCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(category.type)}>
                    {category.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Category Type</Label>
                  <Select 
                    value={editingCategory.type} 
                    onValueChange={(value) => setEditingCategory({ ...editingCategory, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleUpdateCategory} disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? 'Updating...' : 'Update Category'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
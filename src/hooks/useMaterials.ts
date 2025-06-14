
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Material {
  id: string;
  commercial_name: string;
  category: string;
  rock_type: string;
  base_color: string;
  origin: string;
  description: string;
  main_image_url: string;
  is_active: boolean;
  supplier_id: string | null;
  finishes: string[];
  applications: string[];
}

export interface MaterialFormData {
  commercial_name: string;
  category: string;
  rock_type: string;
  base_color: string;
  origin: string;
  description: string;
  finishes: string;
  applications: string;
}

export const useMaterials = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchMaterials = async (): Promise<Material[]> => {
    console.log('Fetching materials from database...');
    
    const { data, error } = await supabase
      .from('materials')
      .select(`
        id,
        commercial_name,
        category,
        rock_type,
        base_color,
        origin,
        description,
        main_image_url,
        is_active,
        supplier_id,
        material_finishes(finish_name),
        material_applications(application_name)
      `)
      .eq('is_active', true)
      .order('commercial_name');

    if (error) {
      console.error('Error fetching materials:', error);
      throw new Error(`Could not fetch materials: ${error.message}`);
    }

    return data.map((material: any) => ({
      id: material.id,
      commercial_name: material.commercial_name,
      category: material.category,
      rock_type: material.rock_type,
      base_color: material.base_color,
      origin: material.origin,
      description: material.description || '',
      main_image_url: material.main_image_url || '/placeholder.svg',
      is_active: material.is_active,
      supplier_id: material.supplier_id,
      finishes: material.material_finishes?.map((f: any) => f.finish_name) || [],
      applications: material.material_applications?.map((a: any) => a.application_name) || [],
    }));
  };

  const materialsQuery = useQuery<Material[], Error>({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
  });

  const createMaterial = useMutation({
    mutationFn: async (formData: MaterialFormData) => {
      const { data: material, error: materialError } = await supabase
        .from('materials')
        .insert({
          commercial_name: formData.commercial_name,
          category: formData.category,
          rock_type: formData.rock_type,
          base_color: formData.base_color,
          origin: formData.origin,
          description: formData.description,
          main_image_url: '/placeholder.svg',
        })
        .select('id')
        .single();
      
      if (materialError) throw materialError;
      
      const materialId = material.id;
      
      // Add finishes
      const finishes = formData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        const { error: finishesError } = await supabase
          .from('material_finishes')
          .insert(finishes.map(finish => ({ 
            material_id: materialId, 
            finish_name: finish 
          })));
        if (finishesError) throw finishesError;
      }

      // Add applications
      const applications = formData.applications.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('material_applications')
          .insert(applications.map(app => ({ 
            material_id: materialId, 
            application_name: app 
          })));
        if (applicationsError) throw applicationsError;
      }

      return materialId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material created successfully." });
    },
    onError: (error: Error) => {
      console.error('Create material error:', error);
      toast({ title: "Error", description: `Failed to create material: ${error.message}`, variant: "destructive" });
    }
  });

  const updateMaterial = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: MaterialFormData }) => {
      // Update main material
      const { error: materialError } = await supabase
        .from('materials')
        .update({
          commercial_name: formData.commercial_name,
          category: formData.category,
          rock_type: formData.rock_type,
          base_color: formData.base_color,
          origin: formData.origin,
          description: formData.description,
        })
        .eq('id', id);

      if (materialError) throw materialError;
      
      // Update finishes
      await supabase.from('material_finishes').delete().eq('material_id', id);
      const finishes = formData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        const { error: finishesError } = await supabase
          .from('material_finishes')
          .insert(finishes.map(finish => ({ 
            material_id: id, 
            finish_name: finish 
          })));
        if (finishesError) throw finishesError;
      }

      // Update applications
      await supabase.from('material_applications').delete().eq('material_id', id);
      const applications = formData.applications.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('material_applications')
          .insert(applications.map(app => ({ 
            material_id: id, 
            application_name: app 
          })));
        if (applicationsError) throw applicationsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material updated successfully." });
    },
    onError: (error: Error) => {
      console.error('Update material error:', error);
      toast({ title: "Error", description: `Failed to update material: ${error.message}`, variant: "destructive" });
    }
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      // Delete related records first
      await supabase.from('material_finishes').delete().eq('material_id', id);
      await supabase.from('material_applications').delete().eq('material_id', id);
      await supabase.from('material_images').delete().eq('material_id', id);
      
      // Delete main material
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: 'Success', description: 'Material deleted successfully.' });
    },
    onError: (error: Error) => {
      console.error('Delete material error:', error);
      toast({ title: 'Error', description: `Failed to delete material: ${error.message}`, variant: 'destructive' });
    }
  });

  return {
    materials: materialsQuery.data || [],
    isLoading: materialsQuery.isLoading,
    isError: materialsQuery.isError,
    error: materialsQuery.error,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
};

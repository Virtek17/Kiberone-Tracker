import { useState } from "react"
import { Group } from "@/types";
import { supabase } from "@/lib/supabase";

export const useGroups = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Полуичть группы
  const fetchGroups = async (): Promise<Group[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const {data, error} = await supabase
        .from('Groups')
        .select("*")
        .order('created_at', {ascending: false})

      if (error) throw error;

      return (data || []).map(g => ({
        ...g,
        createdAt: new Date(g.created_at),
      }));
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке групп:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Создать группу
  const createGroup = async (name: string) : Promise<Group | null> => {
    setLoading(true);
    setError(null);
    try {
      const {data, error} = await supabase
        .from('Groups')
        .insert({name})
        .select()
        .single();

      if (error) throw error;
      return {...data, createdAt: new Date(data.created_at)}
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при создании группы:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }


  const updateGroup = async (id:string, name: string) : Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('Groups')
        .update({ name })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any){

      setError(err.message);
      console.error('Ошибка при обновлении группы:', err);
      return false;

    } finally {
      setLoading(false)
    }

  }

  // Удалить группу (CASCADE удалит и учеников!)
  const deleteGroup = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('Groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошика при удалениби группы:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };

}
import { useState } from "react"
import { Group, Student } from "@/types";
import { supabase } from "@/lib/supabase";

export const useStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Полуичть студента
  const fetchStudents = async (groupId?: string): Promise<Student[] | null> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('Students').select('*');

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(s => ({
        ...s,
        id: s.id,
        name: s.name,
        groupId: s.group_id,
        birthDate: s.birth_date,
        balance: s.balance || 0,
        createdAt: s.created_at ? new Date(s.created_at) : new Date(),
      }));

    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке учеников:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Создать ученика
  const createStudent = async (
    name: string,
    birthDate: string,
    groupId: string,
  ): Promise<Student | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Students')
        .insert({
          name,
          birth_date: birthDate,
          group_id: groupId,
          balance: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        id: data.id,
        name: data.name,
        groupId: data.group_id,
        birthDate: data.birth_date,
        balance: data.balance || 0,
        createdAt: new Date(data.created_at),
      };
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при создании ученика:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Обновить ученика
  const updateStudent = async (
    id: string,
    name: string,
    birthDate: string,
    season?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name,
          birth_date: birthDate,
          season: season || null,
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при обновлении ученика:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удалить ученика
  const deleteStudent = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при удалении ученика:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    error,
    fetchStudents,
    createStudent
  };

}
import { useState } from "react";
import { Student } from "@/types";
import { supabase } from "@/lib/supabase";

export const useStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получить студентов (только не удалённых)
  const fetchStudents = async (groupId?: string): Promise<Student[] | null> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('Students')
        .select('*')
        .eq('is_deleted', false); // ← только активные

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(s => ({
        id: s.id,
        name: s.name,
        groupId: s.group_id,
        birthDate: s.birth_date,
        balance: s.balance || 0,
        createdAt: s.created_at ? new Date(s.created_at) : new Date(),
        isDeleted: s.is_deleted, // ← добавили
      }));

    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке учеников:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Создать студента
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
          is_deleted: false, // ← явно указываем
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        groupId: data.group_id,
        birthDate: data.birth_date,
        balance: data.balance || 0,
        isDeleted: data.is_deleted,
      };
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при создании ученика:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Обновить студента
  const updateStudent = async (
    id: string,
    name: string,
    birthDate: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('Students')
        .update({
          name,
          birth_date: birthDate,
        })
        .eq('id', id)
        .eq('is_deleted', false); // ← нельзя обновлять удалённого

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

  // "Удалить" студента — пометить как удалённого
  const deleteStudent = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('Students')
        .update({ is_deleted: true })
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
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
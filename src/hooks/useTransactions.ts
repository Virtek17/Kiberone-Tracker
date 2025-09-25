// src/hooks/useTransactions.ts
import { useState } from 'react';
import { Transaction } from '@/types';
import { supabase } from '@/lib/supabase';

export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получить транзакции ученика
  const fetchTransactions = async (studentId: string): Promise<Transaction[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Transactions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(t => ({
        ...t,
        id: t.id,
        studentId: t.student_id,
        amount: t.amount,
        type: t.amount >= 0 ? 'add' : 'subtract',
        description: t.description,
        timestamp: t.created_at ? new Date(t.created_at) : new Date(),
      }));
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке транзакций:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Создать транзакцию
  const createTransaction = async (
    studentId: string,
    amount: number,
    description: string
  ): Promise<Transaction | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Transactions')
        .insert({
          student_id: studentId,
          amount,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        id: data.id,
        studentId: data.student_id,
        amount: data.amount,
        type: data.amount >= 0 ? 'add' : 'subtract',
        description: data.description,
        timestamp: data.created_at ? new Date(data.created_at) : new Date(),
      };
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при создании транзакции:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Массовое начисление (опционально — можно сделать отдельно)
  const bulkCreateTransactions = async (
    transactionsData: { student_id: string; amount: number; description: string }[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('Transactions')
        .insert(transactionsData);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при массовом создании транзакций:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchTransactions,
    createTransaction,
    bulkCreateTransactions,
  };
};
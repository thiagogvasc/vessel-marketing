import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';
import { User } from '../types';

export const addUser = async (user: User): Promise<{ error: PostgrestError | null }> => {
  const { id, email, fullname, phone_number, role } = user;

  const { error } = await supabase.from('user').insert([{
		id,
		email,
		fullname,
		phone_number,
		role,
	}]);

  if (error) {
    console.error("Error adding user: ", error.message);
    return { error };
  }

  return { error: null };
};


export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('user').select('*');

  if (error) {
    console.error('Error fetching users:', error.message);
    throw new Error(error.message);
  }

  return data as User[]; // Ensure that your User type matches the structure of your Supabase data
};

export const getUserById = async (userId: string | undefined): Promise<User | null> => {
  if (!userId) {
    console.warn('getUserById called with undefined userId');
    return null;
  }

  const { data, error } = await supabase.from('user').select('*').eq('id', userId).single();

  if (error) {
    console.error('Error fetching user by ID:', error.message);
    return null;
  }

  return data ? (data as User) : null;
};


type PartialUser = Partial<Omit<User, 'id'>>;

export const updateUserById = async (userId: string, updatedData: PartialUser): Promise<void> => {
  try {
    const { error } = await supabase.from('user').update(updatedData).eq('id', userId);

    if (error) {
      console.error('Error updating user:', error.message);
      throw new Error(error.message);
    }

    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

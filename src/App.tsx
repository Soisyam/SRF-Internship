import React, { useEffect, useState } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { supabase } from './supabaseClient';

interface Todo {
  id: string;
  text: string;
  description: string;
  due_date: string;
  completed: boolean;
  created_at: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTodos(data);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        text,
        description,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        completed: false,
      })
      .select()
      .single();

    if (!error && data) {
      setTodos([data as Todo, ...todos]);
      setText('');
      setDescription('');
      setDueDate('');
    }
  };

  const handleToggle = async (todo: Todo) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)
      .select()
      .single();

    if (!error && data) {
      setTodos(todos.map(t => (t.id === todo.id ? data : t)));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const handleFinishAll = async () => {
    const updates = todos.map(todo =>
      supabase.from('todos').update({ completed: true }).eq('id', todo.id)
    );
    await Promise.all(updates);
    fetchTodos();
    alert('All tasks marked as finished!');
  };

  return (
    <div style={{
      backgroundColor: '#fff9c4',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        padding: '30px',
        height: '90vh',
        width: '100%',
        maxWidth: '800px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#000' }}>TODO</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#444', marginTop: '-8px' }}>LIST</div>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Title"
            required
            style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '10px', border: '1px solid #ccc' }}
          />
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '10px', border: '1px solid #ccc' }}
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '10px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{
            padding: '12px',
            backgroundColor: '#ffeb3b',
            fontWeight: 'bold',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}>
            Add Todo
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.length === 0 && <li style={{ fontStyle: 'italic', color: '#777' }}>No todos added yet.</li>}
          {todos.map(todo => (
            <li key={todo.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '12px 15px',
              backgroundColor: todo.completed ? '#e6e6e6' : '#fff9c4',
              borderRadius: '10px',
              marginBottom: '10px',
              border: '1px solid #eee'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
              </div>
              <div style={{ color: '#333', marginTop: '4px' }}>
                {todo.description || <i>No description</i>}
              </div>
              {todo.due_date && (
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  Due: {new Date(todo.due_date).toLocaleString()}
                </div>
              )}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleToggle(todo)} style={{
                  padding: '8px',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <FaCheck />
                </button>
                <button onClick={() => handleDelete(todo.id)} style={{
                  padding: '8px',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <button onClick={handleFinishAll} style={{
            marginTop: '20px',
            padding: '15px 20px',
            backgroundColor: '#ffeb3b',
            fontWeight: 'bold',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}>
            FINISH ALL
          </button>
        )}
      </div>
    </div>
  );
};

export default App;

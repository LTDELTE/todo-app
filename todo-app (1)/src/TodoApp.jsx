
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [taggedUser, setTaggedUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const addTask = () => {
    if (!title) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        note,
        completed: false,
        taggedUser,
        dueDate,
      },
    ]);
    setTitle("");
    setNote("");
    setTaggedUser("");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setNote(task.note);
    setTaggedUser(task.taggedUser);
    setDueDate(task.dueDate);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => task.id === editingTask.id ? {
      ...task,
      title,
      note,
      taggedUser,
      dueDate
    } : task));
    setEditingTask(null);
    setTitle("");
    setNote("");
    setTaggedUser("");
    setDueDate("");
  };

  const filteredTasks = tasks.filter(task => {
    if (!filter) return true;
    return task.taggedUser.includes(filter) || (filter === 'completed' && task.completed);
  });

  const shareTasks = () => {
    const data = encodeURIComponent(JSON.stringify(tasks));
    const url = `${window.location.origin}?tasks=${data}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-Do List App</h1>
      <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" />
      <Textarea placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} className="mb-2" />
      <Input placeholder="Tag user (e.g. @john)" value={taggedUser} onChange={(e) => setTaggedUser(e.target.value)} className="mb-2" />
      <Input placeholder="Due date (YYYY-MM-DD)" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mb-2" />
      <Button onClick={editingTask ? saveEdit : addTask}>{editingTask ? "Save Task" : "Add Task"}</Button>
      <Button onClick={shareTasks} className="ml-2">Share Tasks</Button>

      <Input placeholder="Filter by tag or 'completed'" value={filter} onChange={(e) => setFilter(e.target.value)} className="my-4" />

      <div className="mt-6 space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-white shadow p-4">
            <CardContent className="flex items-start gap-4 justify-between">
              <div className="flex gap-4">
                <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} />
                <div>
                  <h2 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h2>
                  <p className="text-sm text-gray-600">{task.note}</p>
                  {task.taggedUser && <p className="text-sm text-blue-600">Tagged: {task.taggedUser}</p>}
                  {task.dueDate && <p className="text-sm text-red-500">Due: {task.dueDate}</p>}
                </div>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(task)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import type { Task, TaskFormData } from "@/types";
import { parseISO, isValid } from "date-fns";

const TaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().optional(),
  status: z.enum(['To do', 'In progress', 'Done'], {
    required_error: "Status is required",
  }),
  dueDate: z.date().optional(),
  progressCurrent: z.coerce.number().min(0, { message: "Must be a positive number" }).optional(),
  progressTotal: z.coerce.number().min(1, { message: "Must be at least 1" }).optional(),
}).refine(data => {
    if (data.progressCurrent !== undefined && data.progressTotal !== undefined) {
        return data.progressCurrent <= data.progressTotal;
    }
    return true;
}, {
    message: "Current progress cannot exceed total progress",
    path: ["progressCurrent"],
});

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: TaskFormData, taskId?: string) => void;
  taskToEdit?: Task | null;
  defaultStatus?: Task['status'];
}

export function TaskFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  taskToEdit,
  defaultStatus,
}: TaskFormDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Edit mode
        const parsedDate = taskToEdit.dueDate ? parseISO(taskToEdit.dueDate) : undefined;
        form.reset({
          title: taskToEdit.title,
          subtitle: taskToEdit.subtitle,
          status: taskToEdit.status,
          dueDate: parsedDate && isValid(parsedDate) ? parsedDate : undefined,
          progressCurrent: taskToEdit.progressCurrent,
          progressTotal: taskToEdit.progressTotal,
        });
      } else {
        // Add mode
        form.reset({
          title: "",
          subtitle: "",
          status: defaultStatus || 'To do',
          dueDate: undefined,
          progressCurrent: 0,
          progressTotal: 5, // Default total
        });
      }
    }
  }, [isOpen, taskToEdit, defaultStatus, form]);

  const onSubmit = (data: TaskFormData) => {
    onSave(data, taskToEdit?.id);
    onOpenChange(false);
  };

  const mode = taskToEdit ? 'Edit' : 'Add';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{mode} Task</DialogTitle>
          <DialogDescription>
            {mode === 'Edit' ? 'Update the details for your task.' : 'Fill in the details for your new task.'} Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Design homepage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. For Q3 marketing campaign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="To do">To do</SelectItem>
                        <SelectItem value="In progress">In progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="mb-[5px]">Due Date</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="progressCurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Progress</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="progressTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Progress</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

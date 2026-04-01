export type Priority = "low" | "medium" | "high" ;
export type TaskStatus = "to do" | "in progress" | "done" ;

export interface Task {
id: string;
title: string;
description: string;
priority: Priority;
status: TaskStatus;
//createdAt: number;
}

export interface TaskList {
  task: Task;
  next: TaskList | null;
}

// ---------------------------------------------------------    [ Initialize ]

/**
 * Initialize a new TaskList node that holds the given data and has a `null`
 * reference to the next node.
 */
export const initTaskList = (task:Task): TaskList => {
  return { task, next: null };
};

// ---------------------------------------------------------    [ Operations ]

/**
 * Returns a string representation of the list contents with a single space
 * character separating them. If the input list is `null`, return the empty
 * string "". 
 */

export const report = (list: TaskList): string => {
  let cursor = list;
  let buf: string = ""
   while (cursor!=null){
   buf = buf + " " + cursor.task.title;
   cursor = cursor.next;
  }
    return buf.trim();
};

/**
 * Append a new TaskList node onto the end of the provided list, and returns a
 * reference to the first node in the list.
 *
 * If the provided list is empty (meaning it is null), this should initialize a
 * new linked list node and return it, as it would then be the first element of
 * the list.
 *
 * If the provided list is not empty, your job is to use the list's "next"
 * structure to find the last element. The last element's "next" field is null.
 * Once you have a reference to the last node, you can set its "next" field to
 * refer to a node with the given data.
 */
export const append = (list: TaskList, task: Task): TaskList => {
  if (list==null){
    return initTaskList(task)
  }
  
  // traverse linked list to find the last node, indicated by pointing to null
  let cursor = list;
  while (cursor.next!=null){
  cursor = cursor.next;
  }
  // when we get here cursor points to last node in the list.
  cursor.next = initTaskList(task);
  return list;
};

/**
 * Insert a task into a list at a given offset and return a reference to the first
 * item in the list after the insertion is complete. In most cases the return
 * value will simply be the input list, but if the offset is zero, there will be
 * a new first node in the list.
 *
 * The offset refers to the distance from the beginning of the list. So the
 * first element is offset zero, the second is offset one, etc.
 *
 * In the case where the requested offset does not exist, do not perform an
 * insertion and return the list that was provided as a parameter.
 *
 */
export const insert = (list: TaskList, offset: number, task: Task,): TaskList => {
const newList: TaskList = initTaskList(task); 
 
  if (offset == 0){
    newList.next = list;
    return newList;
  }
  let counter = 0;
  let cursor = list;
  while(cursor!=null && counter < offset-1){
counter ++
cursor = cursor.next;
  }
  if (cursor == null){
    // we didn't find it
    return list;
  }
  if (counter == offset -1){
    const next = cursor.next;
    cursor.next = newList;
    newList.next = next;
}
return list;
};

/**
 * Counts the number of elements accessible from the given list and returns that
 * number. If the list is empty (meaning the input list is null) this function
 * returns zero.
 */
export const size = (list: TaskList): number => {
let counter = 0;
let cursor = list;
while (cursor!=null){
  counter = counter +1;
  cursor = cursor.next;
}
return counter;
};

/**
 * Checks if a given Id exists within the list, and if it does, returns the list item at that id. 
 */
export const findID = (list: TaskList, id: string): TaskList | null => {
  if (list==null){
    return null;
  }
  let cursor = list;
  while(cursor.task.id!= id && cursor.next != null){
    cursor = cursor.next;
  }if (cursor.task.id == id){
  return cursor;
  } else {
  return null;
  }
};

/**
 * Return the task found at the given index (offset) in a list.
 *
 * If the offset provided does not exist in the list, return null.
 */
export const getTask = (list: TaskList, offset: number): Task | null => {
  let cursor = list;
  let counter = 0;
  while (cursor!=null){
    if (counter === offset){
    return cursor.task;
  }
  cursor = cursor.next;
  counter = counter+1;
} 
  
if (cursor == null){
    return null;
}
  };

/**
 * Remove the last node from the list and return a reference to the first node.
 *
 * If the list is empty to start with, this should have no effect and return
 * null.
 *
 * If the list has a single item, then that item is removed and we are left with
 * a zero-item list. In that case the function returns null.
 */
export const removeLast = (list: TaskList): TaskList => {
  let cursor = list;
   if (list == null){
    return null;
  }
  while (cursor.next!=null){
    if (cursor.next.next==null){
      cursor.next=null;
return list;
} 
cursor = cursor.next;
  }
  if (cursor.next==null){
    return null;
  }

};

/**
 * Remove the first node from the list and return a reference to what started
 * out as the second node.
 *
 * If the input list is null, or if it is a one-item list, return null to
 * indicate the resulting list is empty.
 */
export const removeFirst = (list: TaskList): TaskList => {
if (list===null){
return null;
} else {
  return list.next;
}


};

/**
 * Remove the element found at the given offset from the list and returns a
 * reference to the first node after performing the removal. If the given offset
 * isn't addressable in the list, take no action and return the input list.
 */
export const removeAt = (list: TaskList, offset: number): TaskList => {
  let cursor = list;
  let counter = 0;
if (cursor == null){
    return list;
  } 
  while (cursor!=null){
    if (counter === offset-1){
    if (cursor.next === null){
return list;
    } cursor.next = cursor.next.next;
    return list;
  } if (counter === offset){
      return cursor.next;
    } 
  cursor = cursor.next;
  counter = counter+1;
} 

};

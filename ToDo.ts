// -------------------------------------------------------- 
// Create linked list format for the to do list

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

export const report = (list: TaskList | null): string => {
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
export const append = (list: TaskList | null, task: Task): TaskList => {
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
export const insert = (list: TaskList | null, offset: number, task: Task,): TaskList | null => {
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
export const size = (list: TaskList | null): number => {
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
export const getTask = (list: TaskList | null, offset: number): Task | null => {
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
return null;
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
export const removeLast = (list: TaskList | null): TaskList | null => {

   if (list == null){
    return null;
  }

  if (list.next==null){
    return null;
  }
let cursor = list;
  while (cursor.next!=null){
    if (cursor.next.next==null){
      cursor.next=null;
return list;
} 
cursor = cursor.next;
  }
return null;
};

/**
 * Remove the first node from the list and return a reference to what started
 * out as the second node.
 *
 * If the input list is null, or if it is a one-item list, return null to
 * indicate the resulting list is empty.
 */
export const removeFirst = (list: TaskList | null): TaskList | null => {
if (list===null){
return null;
} else {
  return list.next;
}


};


/** remove the task found at a specific ID in the list. used to delete a specific item. 
 * returns a reference to the task after it once it is deleted
 * if there is no such id, return the given input list
 * */

export const removeById = (list: TaskList | null, id: string): TaskList | null => {
  let cursor = list;
  if (cursor == null){
    return list;
  } 

if (cursor.task.id === id){
      return cursor.next;}

  while (cursor.next!=null){
    if (cursor.next.task.id === id){
      cursor.next = cursor.next.next;
  return list;
  } 
  cursor = cursor.next;
} 
return list;
};


// --------------------------------------------------------------------------------
//  add stack for undo, delete etc, actions. 
export type ActionType = "ADD" | "DELETE" | "COMPLETE" ;

export interface Action { 
  type: ActionType;
  payload: {
    task?: Task;
    offset?: number;
    previousList?: TaskList | null;
    nextList?: TaskList | null;
  };
};

const undoStack: Action [] = [];
const redoStack: Action [] = [];

function pushAction( action: Action) {
undoStack.push(action);
redoStack.length = 0;
};

function undo(list: TaskList): TaskList {
const action = undoStack.pop();
if (!action){
  return list;
}
redoStack.push(action);
//reverse the action with this thing action.payload
return action.payload.previousList ?? list;
};

function redo(list: TaskList): TaskList {
  const action = redoStack.pop();
  if (!action){
    return list;
  }
  undoStack.push(action);
  return action.payload.nextList ?? list;
};


// =-----------------------------------------------------
// Bridge Functions — the functions the UI calls. 

// These are defined in index.html — declared here to stop VS Code complaints
declare function renderList(): void;
declare function updateStats(): void;
declare function showToast(msg: string): void;

// my variable for my empty linked list. 
/** @type {TaskList | null} */
let taskList: TaskList | null = null;

// ── Called when "+ Add" is clicked ──
// task = { id, title, description, priority, status }
function onAddTask(task: Task) {
 const prev = taskList;
 taskList = append(taskList, task);
  pushAction({
  type: "ADD",
  payload: { previousList: prev, nextList: taskList }
});
   renderList();
   updateStats();
  showToast('Task Added');
}

// ── Called when ✕ is clicked on a card ──
// id = the task's id string
function onDeleteTask(id:string) {
 const prev = taskList;
 taskList = removeById(taskList, id);
  pushAction({
  type: "DELETE",
  payload: { previousList: prev, nextList: taskList }
});
  renderList();
   updateStats();
  showToast('Task Deleted');
}

// ── Called when a checkbox is toggled ──
// id = the task's id string
function onToggleComplete(id: string, taskList:TaskList) {
 const prev = taskList;
 const item = findID(taskList, id);

 if (item != null){
  item.task.status = item.task.status === 'done' ? 'to do' : 'done';
 }

  pushAction({
  type: "COMPLETE",
  payload: { previousList: prev, nextList: taskList }
})
 renderList()
   updateStats()
  showToast('Status Updated');
}

// ── Called when Undo is clicked ──
function onUndo(taskList: TaskList) {
  taskList = undo(taskList);
 renderList()
   updateStats()
  showToast('Task Undone');
}

// ── Called when Redo is clicked ──
function onRedo(taskList: TaskList) {
  taskList = redo(taskList);
 renderList()
   updateStats()
  showToast('Task Restored');
}

// ── Called every render to get the tasks to display ──
// Return an array of Task objects in display order.
// Walk linked list here, and optionally sort via  BST.
function getTasksForDisplay() {
  let taskArray = [];
  let cursor = taskList; 
  while (cursor != null){
  taskArray.push(cursor.task);
  cursor = cursor.next;
  }
  return taskArray; 
}

// ── Called every render to check if undo/redo buttons should be enabled ──
function canUndo() {
  return undoStack.length>0;
}

function canRedo() {
  return redoStack.length>0;
}

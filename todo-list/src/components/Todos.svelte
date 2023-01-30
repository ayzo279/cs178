<script>
    // #Component
    import FilterButton from './FilterButton.svelte'
    import Todo from './Todo.svelte'
    import MoreActions from './MoreActions.svelte'
    import NewTodo from './NewTodo.svelte'

    // #Properties
    export let todos = [];

    // #Reactive
    $: totalTodos = todos.length;
    $: completedTodos = todos.filter((todo) => todo.completed).length;
    
    function addTodo(name) {
        // #Reactive
        todos =[...todos, {id: newTodoID, name, completed: false }];
    }

    function removeTodo(todo) {
        todos = todos.filter((t) => t.id != todo.id);
    }

    function updateTodo(todo) {
        const i = todos.findIndex((t) => t.id === todo.id)
        // #Reactive
        todos[i] = { ...todos[i], ...todo }
    }

    let newTodo = '';

    let newTodoID
        // #Reactive
        $: {
            // #controlFlow
            if (totalTodos === 0) {
                newTodoID = 1;
            }
            else {
                newTodoID = Math.max(...todos.map((t) => t.id)) + 1;
            }
        }

    let filter = 'all';
    const filterTodos = (filter, todos) => 
        filter === 'active' ? todos.filter((t) => !t.completed) :
        filter === 'completed' ? todos.filter((t) => t.completed) :
        todos
    
    const checkAllTodos = (completed) => {
        todos = todos.map((t) => ({ ...t, completed }));
    }
    
    const removeCompletedTodos = () => todos = todos.filter((t) => !t.completed);
</script>
  

<h1> My To-do List </h1>
<!-- Todos.svelte -->
<div class="todoapp stack-large">
    <!-- NewTodo -->
    <!-- #Component and #Properties -->
    <NewTodo autofocus on:addTodo={(e) => addTodo(e.detail)}/>
    <!-- #Component -->
    <FilterButton bind:filter/>
    <!-- TodosStatus -->
    <h2 id="list-heading">{completedTodos} out of {totalTodos} items completed</h2>
  
    <!-- Todos -->
    <ul role="list" class="todo-list stack-large" aria-labelledby="list-heading">
    <!-- #controlFlow -->
    {#each filterTodos(filter, todos) as todo (todo.id)}
    <li class="todo">
        <!-- #Component and #Properties-->
        <Todo {todo} 
        on:update={(e) => updateTodo(e.detail)}
        on:remove={(e) => removeTodo(e.detail)}/>
    </li>
    {:else}
    <li>Nothing to do here!</li>
    {/each}
    </ul>  
  
    <hr />
  
    <!-- MoreActions -->
    <!-- #Component -->
    <MoreActions {todos}
        on:checkAll={(e) => checkAllTodos(e.detail)}
        on:removeCompleted={removeCompletedTodos}
    />

  </div>
  
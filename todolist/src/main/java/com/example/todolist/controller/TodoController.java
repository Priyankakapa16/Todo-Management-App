
package com.example.todolist.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.todolist.dto.TodoDTO;
import com.example.todolist.service.TodoService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // Get all tasks
    @GetMapping
    public List<TodoDTO> getAllTodos() {
        return todoService.getAllTodos();
    }

    // Get task by ID
    @GetMapping("/{id}")
    public TodoDTO getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // Create a new task
    @PostMapping
    public TodoDTO createTodo(@RequestBody @Valid TodoDTO todoDTO) {
        return todoService.createTodo(todoDTO);
    }

    // Update task
    @PutMapping("/{id}")
    public TodoDTO updateTodo(
            @PathVariable Long id,
            @RequestBody @Valid TodoDTO todoDTO) {
        return todoService.updateTodo(id, todoDTO);
    }

    // Delete task
    @DeleteMapping("/{id}")
    public String deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return "Todo deleted successfully";
    }
}

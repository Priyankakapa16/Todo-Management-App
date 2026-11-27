
package com.example.todolist.service;

import com.example.todolist.dto.TodoDTO;
import com.example.todolist.entity.Todo;
import com.example.todolist.exception.TodoNotFoundException;
import com.example.todolist.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // Convert DTO to Entity
    private Todo convertToEntity(TodoDTO dto) {
        Todo todo = new Todo();

        todo.setTitle(dto.title());
        todo.setDescription(dto.description());
        todo.setCompleted(dto.completed());

        return todo;
    }

    // Convert Entity to DTO
    private TodoDTO convertToDTO(Todo todo) {
        return new TodoDTO(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted()
        );
    }

    // Get all tasks
    public List<TodoDTO> getAllTodos() {
        return todoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get task by ID
    public TodoDTO getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));

        return convertToDTO(todo);
    }

    // Create a new task
    public TodoDTO createTodo(TodoDTO dto) {
        Todo todo = convertToEntity(dto);
        Todo savedTodo = todoRepository.save(todo);

        return convertToDTO(savedTodo);
    }

    // Update task
    public TodoDTO updateTodo(Long id, TodoDTO dto) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));

        existingTodo.setTitle(dto.title());
        existingTodo.setDescription(dto.description());
        existingTodo.setCompleted(dto.completed());

        Todo updatedTodo = todoRepository.save(existingTodo);

        return convertToDTO(updatedTodo);
    }

    // Delete task
    public void deleteTodo(Long id) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));

        todoRepository.delete(existingTodo);
    }
}

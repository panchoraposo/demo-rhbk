package com.redhat.demo.quarkus;

import java.util.List;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.mongodb.panache.PanacheMongoRepositoryBase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

class Task {
    public ObjectId id;
    public String text;
}

@ApplicationScoped
class TaskRepository implements PanacheMongoRepositoryBase<Task, ObjectId> {
    // You can add more methods here if needed for queries
}

@Path("/api/tasks")
public class TodoResource {

    @Inject
    TaskRepository taskRepository; // MongoDB repository

    @Inject
    JsonWebToken jwt;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("user")
    public List<Task> getTasks() {
        return taskRepository.listAll();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("user")
    public Response createTask(Task task) {
        taskRepository.persist(task);
        return Response.status(Response.Status.CREATED).entity(task).build();
    }

    @DELETE
    @Path("{id}")
    public Response deleteTask(@PathParam("id") String id) {
        taskRepository.deleteById(new ObjectId(id));
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    // Endpoint protected with JWT authentication
    @GET
    public String getProtected() {
        return "JWT Claims: " + jwt.getClaim("preferred_username");
    }

}
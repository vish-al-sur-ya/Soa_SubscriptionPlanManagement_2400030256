package com.klef.soa.exam.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.klef.soa.exam.entity.SubscriptionPlan;
import com.klef.soa.exam.service.SubscriptionPlanService;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost"})
public class SubscriptionPlanController {
    private final SubscriptionPlanService service;
    public SubscriptionPlanController(SubscriptionPlanService service) { 
    	this.service = service; }

    @GetMapping("/plan")
    public String home() {
    	return "SubscriptionPlan CRUD Service is running"; }

    @PostMapping("/Addplan")
    public SubscriptionPlan add(@Valid @RequestBody SubscriptionPlan plan) { 
    	return service.addPlan(plan); }

    @GetMapping("/DisplayAllplans")
    public List<SubscriptionPlan> displayAll() { 
    	return service.getAllPlans(); }

    @GetMapping("/Displayplan/{id}")
    public SubscriptionPlan find(@PathVariable Long id) { 
    	return service.getPlanById(id); }

    @PutMapping("/Update plan/{id}")
    public SubscriptionPlan update(@PathVariable Long id, @Valid @RequestBody SubscriptionPlan plan) {
    	
        return service.updatePlan(id, plan);
    }

    @DeleteMapping("/Delete plan/{id}")
    public String delete(@PathVariable Long id) {
        service.deletePlan(id);
        return "Subscription plan deleted successfully";
    }
}

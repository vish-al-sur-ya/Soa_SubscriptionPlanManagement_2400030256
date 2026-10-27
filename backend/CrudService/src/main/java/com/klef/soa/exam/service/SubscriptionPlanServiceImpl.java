package com.klef.soa.exam.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.klef.soa.exam.entity.SubscriptionPlan;
import com.klef.soa.exam.repository.SubscriptionPlanRepository;
import com.klef.soa.exam.service.SubscriptionPlanService;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {
    private final SubscriptionPlanRepository repository;
    public SubscriptionPlanServiceImpl(SubscriptionPlanRepository repository) { this.repository = repository; }

    @Override public SubscriptionPlan addPlan(SubscriptionPlan plan) {
        plan.setId(null);
        return repository.save(plan);
    }
    @Override public List<SubscriptionPlan> getAllPlans() { return repository.findAll(); }
    @Override public SubscriptionPlan getPlanById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found: " + id));
    }
    @Override public SubscriptionPlan updatePlan(Long id, SubscriptionPlan plan) {
        SubscriptionPlan existing = getPlanById(id);
        existing.setPlanName(plan.getPlanName());
        existing.setMonthlyCost(plan.getMonthlyCost());
        existing.setMaxUsers(plan.getMaxUsers());
        existing.setActive(plan.getActive());
        return repository.save(existing);
    }
    @Override public void deletePlan(Long id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription plan not found: " + id);
        repository.deleteById(id);
    }
}

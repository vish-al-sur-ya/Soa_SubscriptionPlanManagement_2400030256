package com.klef.soa.exam.service;

import java.util.List;
import com.klef.soa.exam.entity.SubscriptionPlan;

public interface SubscriptionPlanService {
    SubscriptionPlan addPlan(SubscriptionPlan plan);
    List<SubscriptionPlan> getAllPlans();
    SubscriptionPlan getPlanById(Long id);
    SubscriptionPlan updatePlan(Long id, SubscriptionPlan plan);
    void deletePlan(Long id);
}

package Kafka_Project.config;

import java.util.List;
import org.springframework.kafka.core.KafkaAdmin;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    private static final List<String> TOPIC_NAMES = List.of(
        // Page events
        "page_load", "page_view", "page_hidden", "page_visible", "page_unload",
        // Interaction events
        "link_click", "button_click", "mouse_click", "mouse_move", "scroll_depth",
        // Form events
        "form_submit", "form_focus", "form_input",
        // Video events (unified topic for all video event types)
        "video_events",
        // E-commerce events
        "product_view", "cart_add", "cart_remove", "purchase", "checkout_step",
        // Other events
        "periodic_events", "custom_event", "file_download"
    );

    @Bean
    public KafkaAdmin.NewTopics createTopics() {
        
        return new KafkaAdmin.NewTopics(
            TOPIC_NAMES.stream()
                .map(name -> TopicBuilder.name(name)
                    .partitions(3)
                    .replicas(3)
                    .config("min.insync.replicas", "2")
                    .config("retention.ms", "604800000")
                    .build())
                .toArray(NewTopic[]::new)
        );
    }
}   
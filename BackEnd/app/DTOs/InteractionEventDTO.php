<?php

namespace App\DTOs;

/**
 * Interaction Event DTO
 * أحداث التفاعل (نقرات، روابط، إلخ)
 */
class InteractionEventDTO extends AnalyticsEventDTO
{
    public ?int $x;
    public ?int $y;
    public string $element;
    public ?string $elementId;
    public ?string $elementClass;
    public ?string $buttonText;
    public ?string $linkUrl;
    public ?string $linkText;
    public ?bool $isExternal;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->x = isset($data['x']) ? (int)$data['x'] : null;
        $this->y = isset($data['y']) ? (int)$data['y'] : null;
        $this->element = $data['element'] ?? $data['target'] ?? '';
        $this->elementId = $data['element_id'] ?? $data['targetId'] ?? null;
        $this->elementClass = $data['element_class'] ?? $data['targetClass'] ?? null;
        $this->buttonText = $data['button_text'] ?? $data['text'] ?? null;
        $this->linkUrl = $data['link_url'] ?? $data['href'] ?? null;
        $this->linkText = $data['link_text'] ?? $data['text'] ?? null;
        $this->isExternal = isset($data['is_external']) ? (bool)$data['is_external'] : null;
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'x' => $this->x,
            'y' => $this->y,
            'element' => $this->element,
            'element_id' => $this->elementId,
            'element_class' => $this->elementClass,
            'button_text' => $this->buttonText,
            'link_url' => $this->linkUrl,
            'link_text' => $this->linkText,
            'is_external' => $this->isExternal ? 1 : null,
        ]);
    }
}

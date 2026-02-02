<?php

namespace App\DTOs;

/**
 * Form Event DTO
 * أحداث النماذج
 */
class FormEventDTO extends AnalyticsEventDTO
{
    public string $formId;
    public string $formName;
    public ?string $formAction;
    public ?string $formMethod;
    public ?string $fieldName;
    public ?string $fieldType;
    public ?int $fieldCount;
    public ?bool $hasFileUpload;
    public ?bool $success;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->formId = $data['form_id'] ?? '';
        $this->formName = $data['form_name'] ?? 'default_form';
        $this->formAction = $data['form_action'] ?? $data['action'] ?? null;
        $this->formMethod = $data['form_method'] ?? $data['method'] ?? null;
        $this->fieldName = $data['field_name'] ?? null;
        $this->fieldType = $data['field_type'] ?? null;
        $this->fieldCount = isset($data['field_count']) ? (int)$data['field_count'] : null;
        $this->hasFileUpload = isset($data['has_file_upload']) ? (bool)$data['has_file_upload'] : null;
        $this->success = isset($data['success']) ? (bool)$data['success'] : null;
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'form_id' => $this->formId,
            'form_name' => $this->formName,
            'form_action' => $this->formAction,
            'form_method' => $this->formMethod,
            'field_name' => $this->fieldName,
            'field_type' => $this->fieldType,
            'field_count' => $this->fieldCount,
            'has_file_upload' => $this->hasFileUpload ? 1 : null,
            'success' => $this->success ? 1 : null,
        ]);
    }
}

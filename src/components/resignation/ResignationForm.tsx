import { useState } from 'react';
import { FileText } from 'lucide-react';
import { resignationService } from '../../services/resignationService';
import { discordNotifications } from '../../utils/discord';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/feedback/ToastContainer';
import type { Employee } from '../../types';

interface ResignationFormProps {
  employee: Employee;
  onSuccess: () => void;
}

export function ResignationForm({ employee, onSuccess }: ResignationFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();
  
  const [formData, setFormData] = useState({
    passport: '',
    reasonIC: '',
    reasonOOC: '',
    requestDate: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = async () => {
    if (!formData.passport || !formData.reasonIC || !formData.reasonOOC || !formData.requestDate) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      await resignationService.create({
        employeeId: employee.id,
        passport: formData.passport,
        reasonIC: formData.reasonIC,
        reasonOOC: formData.reasonOOC,
        requestDate: formData.requestDate,
      });

      await discordNotifications.resignationRequest(
        employee.name,
        employee.position,
        'pending',
        formData.requestDate,
        formData.passport,
        formData.reasonIC,
        formData.reasonOOC
      );

      show('success', 'Resignation request submitted successfully! 📋');
      setShowModal(false);
      setFormData({
        passport: '',
        reasonIC: '',
        reasonOOC: '',
        requestDate: new Date().toISOString().slice(0, 10),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit resignation request');
    } finally {
      setIsProcessing(false);
    }
  };

  // ... rest of the component code ...
}
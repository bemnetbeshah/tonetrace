import { useParams } from 'react-router-dom';

export default function StudentDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Student Details</h2>
      <p className="text-gray-600">Viewing details for student ID: {id}</p>
    </div>
  );
} 
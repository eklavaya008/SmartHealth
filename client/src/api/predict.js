import client from './client';

export const predictSymptoms = (symptoms) => client.post('/predict', { symptoms }).then((r) => r.data);

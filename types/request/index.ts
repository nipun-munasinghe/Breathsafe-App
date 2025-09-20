import * as Yup from "yup";

export interface CommunityRequestData {
    requestedLocation: string;
    latitude: number;
    longitude: number;
    justification: string;
}

export const validationSchema = Yup.object({
    requestedLocation: Yup.string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters'),
    latitude: Yup.number()
        .required('Please select a location on the map')
        .min(-90, 'Invalid latitude')
        .max(90, 'Invalid latitude'),
    longitude: Yup.number()
        .required('Please select a location on the map')
        .min(-180, 'Invalid longitude')
        .max(180, 'Invalid longitude'),
    justification: Yup.string()
        .required('Justification is required')
        .min(30, 'Justification must be at least 30 characters')
        .max(150, 'Justification cannot exceed 150 characters')
});
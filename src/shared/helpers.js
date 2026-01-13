/**
 * Shared Helper Functions
 * Used across all event blocks
 */
import { dateI18n } from '@wordpress/date';

// Get current date formatted
export const getCurrentDate = () => {
	const now = new Date();
	return dateI18n('Y-m-d', now);
};

// Get default images from plugin data
export const getDefaultImages = () => {
	if (window.evtPluginData && window.evtPluginData.images) {
		return [
			window.evtPluginData.images.crazyDJ || '',
			window.evtPluginData.images.rockBand || '',
			window.evtPluginData.images.foodDistribution || ''
		];
	}
	return ['', '', ''];
};

// Convert 24-hour time to 12-hour AM/PM format
export const formatTime12Hour = (time24) => {
	if (!time24) return '';
	
	const [hours, minutes] = time24.split(':');
	let hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	
	hour = hour % 12;
	hour = hour ? hour : 12; // 0 should be 12
	
	return `${hour}:${minutes} ${ampm}`;
};

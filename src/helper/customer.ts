
import moment from 'moment'

export const convertDate = (dateString: Date) => {
    return moment(dateString).format('YYYY-MM-DD hh:mm A');
}
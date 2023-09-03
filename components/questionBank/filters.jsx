import Icon from '@/components/icons/icons'

export const Filters = ({ filters }) => {

    const subject = filters.subject;
    const type = filters.type;
    const status = filters.status;
    const choice = filters.choice;
    const clearFilter = filters.clearFilter;
    var allFilters = [];

    if(subject != null && subject != "")
        allFilters.push(<div className="flex space-x-2 border-1 p-1 text-gray-700 rounded-md text-sm bg-gray-200 m-1">
                <div><p>{ subject }</p></div>
                <div className="cursor-pointer my-auto" onClick={() => clearFilter("subject") }>
                    <Icon name={'XCircle'} color={'gray'} size={'15'}/>
                </div>
            </div>);
    if(type != null && type != "")
        allFilters.push(<div className="flex space-x-2 border-1 p-1 text-gray-700 rounded-md text-sm bg-gray-200 m-1">
                <div><p>{ type }</p></div>
                <div className="cursor-pointer my-auto" onClick={() => clearFilter("type") }>
                    <Icon name={'XCircle'} color={'gray'} size={'15'}/>
                </div>
            </div>);
    if(status != null && status != "")
        allFilters.push(<div className="flex space-x-2 border-1 p-1 text-gray-700 rounded-md text-sm bg-gray-200 m-1">
                <div><p>{ status }</p></div>
                <div className="cursor-pointer my-auto" onClick={() => clearFilter("status") }>
                    <Icon name={'XCircle'} color={'gray'} size={'15'}/>
                </div>
            </div>);
    if(choice != null && choice != "")
        allFilters.push(<div className="flex space-x-2 border-1 p-1 text-gray-700 rounded-md text-sm bg-gray-200 m-1">
                <div><p>{ choice }</p></div>
                <div className="cursor-pointer my-auto" onClick={() => clearFilter("choice") }>
                    <Icon name={'XCircle'} color={'gray'} size={'15'}/>
                </div>
            </div>);

    return(
        <div className="flex">
            {allFilters}
        </div>
    );
}
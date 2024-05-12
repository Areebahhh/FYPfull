import React from 'react';
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell
} from "@novu/notification-center";

const InAppNotification = ({ subscriberId }) => {
    const novuAppId = "ocA2DXcu2iXe" || ''; // Assuming ocA2DXcu2iXe is a string value

    return (
        <div className="flex justify-end">
            <NovuProvider
                subscriberId={subscriberId}
                applicationIdentifier={novuAppId}
            >
                <PopoverNotificationCenter colorScheme="dark" position='top-end'>
                    {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
                </PopoverNotificationCenter>
            </NovuProvider>
        </div>
    );
}

export default InAppNotification;

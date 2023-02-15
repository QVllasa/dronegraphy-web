import type {Attachment} from '@/types';
import cn from 'classnames';
import client from '@/data/client';
import {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useMutation} from 'react-query';
import Image from '@/components/ui/image';
import {SpinnerIcon} from '@/components/icons/spinner-icon';


function getDefaultValues(attachment: Attachment | null) {
    if (!attachment) return null;
    console.log("getdefaultvalues: ", attachment)
    return attachment;
}

export default function AvatarUploader({onChange, value, name, onBlur}: any) {
    let [attachment, setAttachment] = useState<Attachment | null>(
        getDefaultValues(value)
    );


    useEffect(() => {
        setAttachment(getDefaultValues(value));
    }, [value]);

    const {mutate, isLoading} = useMutation(client.users.avatar, {
        onSuccess: (response) => {
            console.log("response: ", response)
            onChange(response);
            setAttachment(response);
        },
        onError: (error) => {
            console.log(error);
        },
    });
    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log("accepted files", acceptedFiles[0])
            mutate(acceptedFiles[0]);
        },
        [mutate]
    );
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop,
    });


    return (
        <div className="flex flex-wrap gap-2.5">
            <div
                {...getRootProps({
                    className: cn(
                        'h-36 w-full rounded relative hover:bg-dark-300 border-dashed border-2 border-light-500 dark:border-dark-600 text-center flex flex-col justify-center hover:text-black dark:hover:text-light items-center cursor-pointer focus:border-accent-400 focus:outline-none',
                    ),
                })}
            >
                <input
                    {...getInputProps({
                        name,
                        onBlur,
                    })}
                />
                {attachment ?
                    (
                        <div>
                            <div className="relative h-20 w-20 overflow-hidden rounded-full">
                                <Image
                                    alt="Avatar"
                                    src={attachment?.path}
                                    layout="fill"
                                    objectFit="scale-down"
                                />
                            </div>
                        </div>
                    )
                    : 'Upload Your Avatar Image (80 X 80)'
                }

                {isLoading && (
                    <span className="mt-2.5 flex items-center gap-1 font-medium text-light-500">
                        <SpinnerIcon className="h-auto w-5 animate-spin text-brand"/>{' '}
                        {'Loading...'}
                    </span>
                )}
            </div>
        </div>
    );
}

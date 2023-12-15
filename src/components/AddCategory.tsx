'use client'
import { useAppSelector } from "@/store/hook";
import { ICategory } from "@/types";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"

export default function AddCategory() {
    const router = useRouter()
    const { user } = useAppSelector(state => state.user)
    const { token } = user as { token: string }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ICategory>()
    const onSubmit: SubmitHandler<ICategory> = async (data) => {
        // console.log(data)
        const formData = new FormData();
        formData.append('image', data.image[ 0 ]);
        const imgApi = "187d3aec661ecb2f9b3fa1a76eab6014";
        await fetch(`https://api.imgbb.com/1/upload?key=${imgApi}`, {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(async (res) => {
                const image = res.data.display_url;
                data.image = image;
                await fetch(`${process.env.BACKEND_URL}/api/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token,
                    },
                    body: JSON.stringify(data),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (!!res.success) {
                            toast.success(res.message);
                            router.refresh();
                        }
                        else {
                            toast.error(res.message);
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        toast.error('Something went wrong!');
                        // router.push('/');
                    });
            })
    }

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new category</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                                {errors.name && <small>Name field is required</small>}
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: true })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type category name" required />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                                {errors.image && <small>This field is required</small>}
                                <input
                                    id="image"
                                    {...register("image")}
                                    type="file"
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                {errors.description && <small>This field is required</small>}
                                <textarea
                                    id="description"
                                    {...register("description", { required: true })}
                                    rows={8}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Add category
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}

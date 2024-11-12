import { createImageUpload } from "./plugins/upload-images";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface UploadOptions {
	bucket?: string;
	path?: string;
}

interface UploadFile extends UploadOptions {
	file: File;
}

export interface UploadResult {
	publicUrl: string;
}

/**
 * Upload an image to Supabase Storage
 *
 * @param file - File to upload
 * @param options - Upload options
 * @returns Promise<string> - Public URL of the uploaded image
 */
const upload = async ({
	file,
	bucket = "images",
	path = "email",
}: UploadFile) => {
	try {
		console.log("uploading file");
		const timestamp = Date.now();
		const fileName = `${timestamp}-${file.name}`;
		const filePath = `${path}/${fileName}`;

		console.log(timestamp, fileName, filePath);

		const { error } = await supabase.storage
			.from(bucket)
			.upload(filePath, file);

		console.log(error);
		if (error) throw error;

		const {
			data: { publicUrl },
		} = supabase.storage.from(bucket).getPublicUrl(filePath);

		console.log(publicUrl);
		if (!publicUrl) {
			throw new Error("No public URL returned from upload action");
		}

		return publicUrl;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
};

/**
 * Upload an image
 *
 * @param file - File to upload
 * @param options - Upload options
 * @returns Promise<string> - Public URL of the uploaded image
 */
const onUpload = (file: File, options: UploadOptions) => {
	return new Promise((resolve) => {
		toast.promise(
			upload({ file, bucket: options.bucket, path: options.path }).then(
				(publicUrl) => {
					// preload the image
					const image = new Image();
					image.src = publicUrl;
					image.onload = () => {
						resolve(publicUrl);
					};
				},
			),
			{
				loading: "Uploading image...",
				success: "Image uploaded successfully.",
				error: "Error uploading image. Please try again.",
			},
		);
	});
};

/**
 * Create an image upload function
 *
 * @param options - Upload options
 * @returns Image upload function
 */
export const uploadFn = (options: UploadOptions) =>
	createImageUpload({
		onUpload: (file: File) => onUpload(file, options),
		validateFn: (file) => {
			// check if file is an image
			if (!file.type.includes("image/")) {
				toast.error("File type not supported.");
				return false;
			}

			// 20MB max
			if (file.size / 1024 / 1024 > 20) {
				toast.error("File size too big (max 20MB).");
				return false;
			}

			return true;
		},
	});

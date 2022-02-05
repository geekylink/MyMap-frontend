import {useState} from "react";
import axios from "axios";

type FileUploadProps = {
    url: string;
    OnFinish?: (success: boolean) => void;
}

export const FileUpload = ({
    url,
    OnFinish = (success) => {
        if (success) alert("File uploaded successfully!");
        else alert("File upload failed...");
    }
}: FileUploadProps) => {

    const [imgPreview, setImgPreview] = useState("");
    const [file, setFile] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleImagePreview = (e: any) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0]);
        let image_as_files = e.target.files[0];

        setImgPreview(image_as_base64);
        setFile(image_as_files);
    }

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    }

    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value);
    }

    const handleSubmitFile = () => {
        if (file === null) {
            return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);

        axios.post(
            url, formData,
            {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }
        )
        .then(res => {
            console.log(res.data);
            if (res.data.status == "OK") {
                console.log("Successful upload.");
                if (OnFinish) OnFinish(true);
            }
            else {
                console.log("Error while uploading file:");
                console.log(res.data.error);
                if (OnFinish) OnFinish(false);
            }
        })
        .catch(err => {
            console.log("Server returned an error while uploading file:");
            console.log(err);
            if (OnFinish) OnFinish(false);
        });
    }

    return(<>
        <div>{ title }</div>
        {(imgPreview != "") ? <img src={imgPreview} alt="image preview" height="200px" width="200px" /> : <label>Upload a file</label>}

        <div>{description}</div>
        <hr/>
        
        <input type="file" 
                onChange={handleImagePreview} 
        /><br />
        
        {(imgPreview != "") ? (<>
            <label>Title:</label>
            <input type="text" onChange={handleTitleChange} /><br/>
            <label>Description:</label>
            <textarea onChange={handleDescriptionChange} /><br/>
        </>) : null}

        <input type="submit" value="Upload file" 
                onClick={handleSubmitFile} 
        />
        
    </>);
}

"use client";

import { FileItem, Server } from '@/lib/types';
import { ChevronRight, File, FileCode, FileText, FolderOpen, FolderPlus, Home, RefreshCw, Search, Settings, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { getFiles } from '@/services/server.service';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

function getFileIcon(name: string) {
    const ext = name.split(".").pop()?.toLowerCase()
    if (ext === "json" || ext === "yml" || ext === "yaml" || ext === "properties") {
        return <Settings className="h-4 w-4 text-chart-3" />
    }
    if (ext === "txt" || ext === "log") {
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
    if (ext === "jar") {
        return <FileCode className="h-4 w-4 text-chart-5" />
    }
    return <File className="h-4 w-4 text-muted-foreground" />
}

function FileBrowser({ server }: { server: Server }) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPath, setCurrentPath] = useState("");

    const fetchFiles = async () => {
        try {
            const f = await getFiles(server._id);
            console.log(f);
            setFiles(f);
        } catch (error) {} // error = server offline (TODO: fix in future)
    }

    useEffect(() => {
        fetchFiles();
    }, [])

    const pathParts = currentPath.split("/").filter(Boolean);

    const filteredFiles = files
        .filter(
        (f) =>
            !searchQuery ||
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
            return a.name.localeCompare(b.name)
        });

    const handleNavigate = (path: string) => {
        setCurrentPath(path)
        setSearchQuery("")
    }
    
    if (!server) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground">Server not found</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">File Browser</h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className='border-border text-foreground bg-transparent hover:bg-accent'>
                        <Upload className='mr-2 h-4 w-4' /> Upload
                    </Button>
                    <Button variant="outline" size="sm" className='border-border text-foreground bg-transparent hover:bg-accent'>
                        <FolderPlus className='mr-2 h-4 w-4' /> New Folder
                    </Button>
                </div>
            </div>

            <Card className='flex-1 flex flex-col overflow-hidden'>
                <CardHeader className='py-3 px-4 border-b border-border'>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <Button variant={"ghost"} size={"icon"} className='h-7 w-7 text-muted-foreground hover:text-foreground' onClick={() => handleNavigate("/")}>
                                <Home className='h-4 w-4' />
                            </Button>

                            <ChevronRight className='h-4 w-4 text-muted-foreground' />
                            {pathParts.length === 0 ? (
                                <span className="text-foreground font-medium">root</span>
                            ) : (
                                pathParts.map((part, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleNavigate(`/${pathParts.slice(0, index + 1).join("/")}`)
                                            }
                                            className={cn(
                                                "hover:text-foreground transition-colors",
                                                index === pathParts.length - 1
                                                ? "text-foreground font-medium"
                                                : "text-muted-foreground"
                                            )}
                                        >
                                            {part}
                                        </button>
                                        {
                                            index < pathParts.length - 1 && (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )
                                        }
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.validationMessage)} placeholder='Search files...' className="pl-9 h-8 w-48 bg-input border-border text-foreground text-sm"/>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={fetchFiles}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className='flex-1 p-0 overflow-auto max-h-140'>
                    <Table>
                        <TableHeader>
                            <TableRow className='border-border hover:bg-transparent'>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground w-25">Size</TableHead>
                                <TableHead className="text-muted-foreground w-45">Modified</TableHead>
                                <TableHead className="w-12.5" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentPath !== "/" && (
                                <TableRow className='border-border cursor-pointer hover:bg-accent/50' onClick={() => handleNavigate("/" + pathParts.slice(0, -1).join("/") || "/")}>
                                    <TableCell className='text-foreground'>
                                        <div className="flex items-center gap-3">
                                            <FolderOpen className='h-4 w-4 text-primary' />
                                            <span>..</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">-</TableCell>
                                    <TableCell className="text-muted-foreground">-</TableCell>
                                    <TableCell />
                                </TableRow>
                            )}
                            {filteredFiles.map((file) => (
                                <TableRow key={file.name} className='border-border cursor-pointer hover:bg-accent/50'>
                                    <TableCell className='text-foreground'>
                                        <div className="flex items-center gap-3">
                                            {file.isDirectory ? (
                                                <FolderOpen className='h-4 w-4 text-primary' />
                                            ) : (
                                                getFileIcon(file.name)
                                            )}
                                            <span>{file.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {file.size || "-"} MB
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(file.modified).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default FileBrowser
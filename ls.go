package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
)

type ListDirectory struct {
	directory string
}

func isDirectory(filename string) bool {
	file, err := os.Open(filename)
	if err != nil {
		return false
	}
	fileInfo, err := file.Stat()
	if err != nil {
		return false
	}
	return fileInfo.Mode().IsDir()
}

func (ls ListDirectory) executeLsCommand() {
	if _, err := os.Stat(ls.directory); os.IsNotExist(err) {
		fmt.Println(string("\033[31m"), "Directory does not exist")
		os.Exit(1)
	}
	content, err := ioutil.ReadDir(ls.directory)
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range content {
		var name string = file.Name()
		var size int = int(file.Size())
		var isDir bool = isDirectory(path.Join(ls.directory, name))
		var color string = ""
		if isDir {
			color = "\033[34m"
		} else {
			color = "\033[33m"
		}

		nameString := string(color) + name
		fmt.Println(nameString, " -> ", size)
	}
}

func main() {
	var arguments []string = os.Args[1:]
	var directory string = ""
	if len(arguments) > 0 {
		directory = arguments[0]
	} else {
		directory, _ = os.Getwd()
	}
	var ls ListDirectory = ListDirectory{directory: directory}
	ls.executeLsCommand()
}

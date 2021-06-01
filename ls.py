import os
import clint
import sys
import pathlib

class CommandError(object):
    def __init__(self, error_message, is_fatal=True):
        self.message = error_message
        self.is_fatal = is_fatal

        self.evoke_exception()

    def evoke_exception(self):
        print(clint.textui.colored.red(f"ERROR: {self.message}"))
        if self.is_fatal:
            sys.exit()

class ListDirectories(object):
    def __init__(self, directory):
        self.directory = directory
        self.execute_ls_command(self.directory)

    def execute_ls_command(self, directory):
        if not os.path.isdir(directory):
            CommandError(f"{directory} is not adirectory")

        files = os.listdir(directory)
        for filename in files:
            filepath = os.path.join(directory, filename)
            file_size = pathlib.Path(filepath).stat().st_size
            
            color = clint.textui.colored.blue if os.path.isdir(filepath) else clint.textui.colored.yellow
            print(f"{color(filename)} -> ", clint.textui.colored.cyan(f"[size:{file_size} bytes]"))

directory = None
arguments = sys.argv[1:]

if len(arguments) > 0:
    directory = arguments[0]

ls = ListDirectories(directory or os.getcwd())

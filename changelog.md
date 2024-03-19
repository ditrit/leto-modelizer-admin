# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added

* Setup project.
* Setup global application design.
* Setup authentication from `leto-modelizer`.
* Setup CSRF token management.
* Setup Users page with:
  * Table to display all users.
  * Add action to redirect on user page.
  * Add action to delete a user.
* Setup User page with:
  * Display all information of a user.
  * Display all groups related to a user.
  * Display all roles related to a user.
  * Redirect to leto-modelizer if current user is deleted.
  * Add action to attach one or multiple existing groups to the selected user.
  * Add action to detach a group to the selected user.
  * Add action to attach one or multiple existing roles to the selected user.
  * Add action to detach a role to the selected user.
* Setup Roles page with:
  * Table to display all roles.
  * Add action to redirect on role page.
  * Add action to delete a role.
* Setup Role page with:
  * Display all information of a role.
  * Display all users related to a role.
  * Display all groups related to a role.
  * Display all sub roles related to a role.
  * Display all permissions related to a role.
  * Add action to attach one or multiple existing users to the selected role.
  * Add action to detach a user to the selected role.
  * Add action to attach one or multiple existing groups to the selected role.
  * Add action to detach a group to the selected role.
  * Add action to attach one or multiple existing roles to the selected role.
  * Add action to detach a group to the selected role.
  * Add action to attach one or multiple existing permissions to the selected role.
  * Add action to detach a permission to the selected role.
* Setup Libraries page with:
  * Table to display all libraries.
  * Add action to redirect on library page.
  * Add action to delete a library.
  * Add action to add a library.
* Setup Add Library page.
* Setup Library page with:
  * Display all information of a library.
  * Add form to synchronize library.
  * Display all templates of a library.
* Setup Groups page with:
  * Table to display all groups.
  * Add action to redirect on group page.
  * Add action to delete a group.
* Setup Group page with:
  * Display all information of a group.
  * Display all users related to a group.
  * Display all groups related to a group.
  * Display all roles related to a group.
  * Display all permissions related to a group.
  * Add action to attach one or multiple existing users to the selected group.
  * Add action to detach a user to the selected group.
  * Add action to attach one or multiple existing groups to the selected group.
  * Add action to detach a group to the selected group.
  * Add action to attach one or multiple existing roles to the selected group.
  * Add action to detach a role to the selected group.

import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles = ['Admin', 'Engineer', 'Operator'];
  newUser = { username: '', password: '', role: 'Operator' };

constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

	addUser() {
	  if (!this.newUser.username || !this.newUser.password) {
		this.toastr.error("يرجى إدخال اسم المستخدم وكلمة المرور");
		return;
	  }

	  this.userService.addUser(this.newUser.username, this.newUser.password, this.newUser.role)
		.subscribe({
		  next: () => {
			this.toastr.success("تمت إضافة المستخدم");
			this.loadUsers();
			this.newUser = { username: '', password: '', role: 'Operator' };
		  },
		  error: err => alert(err.error)
		});
	}

  changeRole(user: User) {
    this.userService.updateRole(user.id, user.role).subscribe(() => {
      this.toastr.success('تم تحديث صلاحية المستخدم');
    });
  }

  changePassword(user: User) {
    const newPassword = prompt(`أدخل كلمة مرور جديدة لـ ${user.username}:`);
    if (newPassword) {
      this.userService.updatePassword(user.id, newPassword).subscribe(() => {
        this.toastr.success('تم تغيير كلمة المرور بنجاح');
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${user.username}؟`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
		this.toastr.info("تم حذف المستخدم");

      });
    }
  }
  
	  exportToExcel() {
	  const worksheet = XLSX.utils.json_to_sheet(this.users);
	  const workbook = XLSX.utils.book_new();
	  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
	  XLSX.writeFile(workbook, "users.xlsx");
	}

	exportToPDF() {
	  const doc = new jsPDF();
	  autoTable(doc, {
		head: [['#', 'Username', 'Role']],
		body: this.users.map((u, i) => [i + 1, u.username, u.role])
	  });
	  doc.save("users.pdf");
	}

}
